import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const STORAGE_KEY = "bluewave_quotation_draft_v1";

const COMPANY = {
  name: "BLUEWAVE",
  subtitle: "PLUMBERS",
  tagline: "Your allround plumbing partner",
  address: "Maasai Lodge Rd, Next to NIBS, Rongai",
  phone: "(+254) 797-965-768",
  paybill: "714888",
  account: "415225",
  contactName: "Benard",
  contactPhone: "0789163456",
};

const makeQuotationNumber = () => {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BW-${date}-${suffix}`;
};

const defaultItem = {
  description: "",
  quantity: 1,
  unit: "Pcs",
  rate: "",
};

const createDefaultValues = () => ({
  quotationNumber: makeQuotationNumber(),
  date: new Date().toISOString().split("T")[0],
  validUntil: "",
  customerName: "",
  customerId: "",
  preparedBy: "",
  paymentTerms: "CASH BASIS",
  discount: 0,
  taxRate: 0,
  notes: "",
  items: [{ ...defaultItem }],
});

function loadInitialValues() {
  const defaults = createDefaultValues();
  if (typeof window === "undefined") return defaults;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return defaults;

    return {
      ...defaults,
      ...parsed,
      items:
        Array.isArray(parsed.items) && parsed.items.length
          ? parsed.items.map((item) => ({ ...defaultItem, ...item }))
          : [{ ...defaultItem }],
    };
  } catch (error) {
    console.warn("Could not restore quotation draft:", error);
    return defaults;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateItemAmount(item) {
  return (Number(item?.quantity) || 0) * (Number(item?.rate) || 0);
}

/**
 * Best-effort parser for simple lines such as:
 * "20 PPR pipes at 350 each"
 * "5 elbows - 120"
 * Parsing is intentionally conservative: users can review and edit every result.
 */
function parseQuotationText(text) {
  const lines = text
    .split(/\n|;/)
    .map((line) => line.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);

  const items = [];
  let customerName = "";

  for (const line of lines) {
    const customerMatch = line.match(/\bfor\s+([A-Za-z][A-Za-z .'-]{1,50})$/i);
    if (customerMatch && !/\bat\s+K?Sh?\s*[\d,]+/i.test(line)) {
      customerName = customerMatch[1].trim();
    }

    const match =
      line.match(/^(\d+(?:\.\d+)?)\s+(.+?)\s+(?:at|@)\s*(?:KSh\.?\s*)?([\d,]+(?:\.\d{1,2})?)\s*(?:each|per\s+\w+)?$/i) ||
      line.match(/^(\d+(?:\.\d+)?)\s+(.+?)\s*[-:]\s*(?:KSh\.?\s*)?([\d,]+(?:\.\d{1,2})?)$/i);

    if (!match) continue;

    const quantity = Number(match[1]);
    const description = match[2].trim();
    const rate = Number(match[3].replace(/,/g, ""));
    if (!description || !Number.isFinite(quantity) || !Number.isFinite(rate)) continue;

    items.push({
      description,
      quantity,
      unit: "Pcs",
      rate,
    });
  }

  return { items, customerName };
}

export default function QuotationForm() {
  const previewRef = useRef(null);
  const skipNextAutosave = useRef(false);
  const [draftStatus, setDraftStatus] = useState("Draft restored from this browser when available.");
  const [quotationText, setQuotationText] = useState("");
  const [parseMessage, setParseMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const initialValuesRef = useRef(null);
  if (!initialValuesRef.current) initialValuesRef.current = loadInitialValues();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialValuesRef.current,
    mode: "onChange",
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "items",
  });

  const formData = useWatch({ control });
  const watchedItems = formData?.items || [];

  const subtotal = useMemo(
    () => watchedItems.reduce((sum, item) => sum + calculateItemAmount(item), 0),
    [watchedItems]
  );
  const discountAmount = Math.min(
    subtotal,
    Math.max(0, Number(formData?.discount) || 0)
  );
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * (Math.max(0, Number(formData?.taxRate) || 0) / 100);
  const total = taxableAmount + taxAmount;

  // Persist the complete form, including dynamically added line items.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    if (skipNextAutosave.current) {
      skipNextAutosave.current = false;
      return undefined;
    }

    setDraftStatus("Saving draft…");
    const timeoutId = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        setDraftStatus(`Draft saved at ${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`);
      } catch (error) {
        console.error("Could not save quotation draft:", error);
        setDraftStatus("Draft could not be saved. Check browser storage.");
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [formData]);

  const addItem = () => append({ ...defaultItem });

  const duplicateItem = (index) => {
    const item = getValues(`items.${index}`);
    insert(index + 1, { ...defaultItem, ...item });
  };

  const handleQuantityChange = (index, value) => {
    setValue(`items.${index}.quantity`, value === "" ? "" : Math.max(0, Number(value) || 0), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRateChange = (index, value) => {
    setValue(`items.${index}.rate`, value === "" ? "" : Math.max(0, Number(value) || 0), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleParseQuotation = () => {
    const parsed = parseQuotationText(quotationText);
    if (!parsed.items.length) {
      setParseMessage(
        'No line items detected. Try one item per line, e.g. "20 PPR pipes at 350 each". You can also fill in the structured form manually.'
      );
      return;
    }

    const current = getValues();
    const nextItems = parsed.items;
    reset({
      ...current,
      customerName: parsed.customerName || current.customerName,
      items: nextItems,
    });
    setParseMessage(
      `Imported ${nextItems.length} item${nextItems.length === 1 ? "" : "s"}. Review the fields and amounts before generating the quotation.`
    );
  };

  const clearDraftAndReset = () => {
    const freshValues = createDefaultValues();
    skipNextAutosave.current = true;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Could not clear quotation draft:", error);
    }
    reset(freshValues);
    setQuotationText("");
    setParseMessage("");
    setDraftStatus("Quotation generated. Draft cleared.");
  };

  const downloadPDF = async () => {
    if (!previewRef.current || isGenerating) return false;

    setIsGenerating(true);
    try {
      // Let React finish rendering the latest form values before capturing the preview.
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: Math.max(document.documentElement.clientWidth, 1024),
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 8;
      const printableWidth = pageWidth - margin * 2;
      const printableHeight = pageHeight - margin * 2;
      const pixelsPerMm = canvas.width / printableWidth;
      const pageCanvasHeight = Math.floor(printableHeight * pixelsPerMm);
      let sourceY = 0;
      let pageIndex = 0;

      while (sourceY < canvas.height) {
        const sliceHeight = Math.min(pageCanvasHeight, canvas.height - sourceY);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const context = pageCanvas.getContext("2d");
        if (!context) throw new Error("Could not prepare PDF page.");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        context.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );

        const imageData = pageCanvas.toDataURL("image/jpeg", 0.95);
        const renderedHeight = sliceHeight / pixelsPerMm;
        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(imageData, "JPEG", margin, margin, printableWidth, renderedHeight);

        sourceY += sliceHeight;
        pageIndex += 1;
      }

      const quotationNumber = String(getValues("quotationNumber") || "quotation")
        .replace(/[^a-zA-Z0-9_-]/g, "-");
      pdf.save(`quotation-${quotationNumber}.pdf`);

      // Clear only after the PDF generation/save call succeeds.
      clearDraftAndReset();
      return true;
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setDraftStatus("PDF generation failed. Your draft has been kept.");
      window.alert("Unable to generate the quotation PDF. Your draft has been kept; please try again.");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (values) => {
    const hasValidItem = (values.items || []).some(
      (item) =>
        String(item.description || "").trim() &&
        Number(item.quantity) > 0 &&
        Number(item.rate) >= 0 &&
        item.rate !== ""
    );

    if (!hasValidItem) {
      window.alert("Add at least one line item with a description, quantity, and rate.");
      return;
    }

    if (values.validUntil && values.date && values.validUntil < values.date) {
      window.alert("The validity date cannot be earlier than the quotation date.");
      return;
    }

    await downloadPDF();
  };

  const discardDraft = () => {
    const confirmed = window.confirm(
      "Discard this quotation draft and clear all entered details? This cannot be undone."
    );
    if (!confirmed) return;

    clearDraftAndReset();
    setDraftStatus("Draft discarded.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Quotation</h1>
            <p className="mt-1 text-sm text-gray-600">
              Enter the details, review the live preview, then generate a PDF.
            </p>
            <p className="mt-2 text-xs text-gray-500" aria-live="polite">
              {draftStatus}
            </p>
          </div>
          <button
            type="button"
            onClick={discardDraft}
            className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Discard draft
          </button>
        </header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[460px_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Quick quotation entry</h2>
              <p className="mt-1 text-sm text-gray-600">
                Type or paste one item per line. Supported examples:
                <span className="mt-1 block font-mono text-xs">
                  20 PPR pipes at 350 each
                  <br />
                  5 elbows - 120
                </span>
              </p>
              <textarea
                value={quotationText}
                onChange={(event) => setQuotationText(event.target.value)}
                rows={5}
                placeholder={"20 PPR pipes at 350 each\n5 elbows at 120 each"}
                className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleParseQuotation}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Parse quotation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuotationText("");
                    setParseMessage("");
                  }}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Clear text
                </button>
              </div>
              {parseMessage && (
                <p className="mt-3 text-sm text-gray-600" aria-live="polite">
                  {parseMessage}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Parsing is a convenience, not a final check. Review every imported field before generating the PDF.
              </p>
            </section>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-white p-5 shadow-sm">
              <section>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Quotation information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Quotation No.</label>
                    <input
                      {...register("quotationNumber", { required: "Quotation number is required" })}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                    {errors.quotationNumber && (
                      <p className="mt-1 text-xs text-red-600">{errors.quotationNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Date</label>
                    <input
                      type="date"
                      {...register("date", { required: "Date is required" })}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                    {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Valid until</label>
                    <input type="date" {...register("validUntil")} className="w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Customer ID</label>
                    <input {...register("customerId")} placeholder="Optional" className="w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                </div>
              </section>

              <hr className="my-6" />

              <section>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Customer</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Bill to</label>
                    <input
                      {...register("customerName", { required: "Customer name is required" })}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-red-600">{errors.customerName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Prepared by</label>
                    <input
                      {...register("preparedBy", { required: "Prepared by is required" })}
                      placeholder="e.g. Benard Chunga"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                    {errors.preparedBy && (
                      <p className="mt-1 text-xs text-red-600">{errors.preparedBy.message}</p>
                    )}
                  </div>
                </div>
              </section>

              <hr className="my-6" />

              <section>
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Items</h2>
                  <button type="button" onClick={addItem} className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800">
                    + Add item
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => {
                    const item = watchedItems[index] || field;
                    return (
                      <div key={field.id} className="rounded-lg border bg-gray-50 p-4">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">Item {index + 1}</span>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => duplicateItem(index)} className="text-sm font-medium text-blue-700 hover:text-blue-900">
                              Duplicate
                            </button>
                            {fields.length > 1 && (
                              <button type="button" onClick={() => remove(index)} className="text-sm text-red-600 hover:text-red-800">
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium">Description</label>
                          <input
                            {...register(`items.${index}.description`, { required: "Description is required" })}
                            className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                            placeholder="e.g. Danco PPR Pipe 25 mm"
                          />
                          {errors.items?.[index]?.description && (
                            <p className="mt-1 text-xs text-red-600">{errors.items[index].description.message}</p>
                          )}
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium">Qty</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity ?? ""}
                              onChange={(event) => handleQuantityChange(index, event.target.value)}
                              className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium">Unit</label>
                            <input {...register(`items.${index}.unit`)} className="w-full rounded-md border bg-white px-3 py-2 text-sm" placeholder="Pcs" />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium">Rate (KSh)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate ?? ""}
                              onChange={(event) => handleRateChange(index, event.target.value)}
                              className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <div className="mt-3 text-right text-sm font-semibold">
                          Amount: KSh {formatCurrency(calculateItemAmount(item))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <hr className="my-6" />

              <section>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment and adjustments</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Payment terms</label>
                    <input {...register("paymentTerms")} className="w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Discount (KSh)</label>
                    <input type="number" min="0" step="0.01" {...register("discount", { valueAsNumber: true, min: 0 })} className="w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Tax rate (%)</label>
                    <input type="number" min="0" max="100" step="0.01" {...register("taxRate", { valueAsNumber: true, min: 0, max: 100 })} className="w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Notes / scope of work</label>
                    <textarea {...register("notes")} rows={2} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Optional notes" />
                  </div>
                </div>
              </section>

              <div className="mt-6 rounded-lg bg-gray-100 p-4 text-sm">
                <div className="flex justify-between gap-4"><span>Subtotal</span><span>KSh {formatCurrency(subtotal)}</span></div>
                <div className="mt-2 flex justify-between gap-4"><span>Discount</span><span>− KSh {formatCurrency(discountAmount)}</span></div>
                <div className="mt-2 flex justify-between gap-4"><span>Tax ({Number(formData?.taxRate) || 0}%)</span><span>KSh {formatCurrency(taxAmount)}</span></div>
                <div className="mt-3 flex justify-between gap-4 border-t border-gray-300 pt-3">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold">KSh {formatCurrency(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="mt-6 w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? "Generating PDF…" : "Generate quotation PDF"}
              </button>
            </form>
          </div>

          <section className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Live preview</h2>
                <p className="text-xs text-gray-500">Updates as you edit the form.</p>
              </div>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleSubmit(onSubmit)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isGenerating ? "Generating…" : "Generate PDF"}
              </button>
            </div>

            <div className="overflow-auto rounded-xl bg-gray-300 p-3 shadow-inner sm:p-5">
              <div
                ref={previewRef}
                className="mx-auto bg-white text-black"
                style={{
                  width: "794px",
                  minHeight: "1123px",
                  boxSizing: "border-box",
                  padding: "32px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", borderBottom: "2px solid #111", paddingBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "1px" }}>{COMPANY.name}</div>
                    <div style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "1px" }}>{COMPANY.subtitle}</div>
                    <div style={{ marginTop: "4px", fontSize: "11px", color: "#444" }}>{COMPANY.tagline}</div>
                    <div style={{ marginTop: "12px", fontSize: "10px", lineHeight: 1.5 }}>
                      {COMPANY.address}<br />Phone: {COMPANY.phone}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "150px" }}>
                    <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "1px" }}>QUOTATION</div>
                    <div style={{ marginTop: "5px", fontSize: "11px" }}>No. <strong>{formData?.quotationNumber || "—"}</strong></div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: "18px", border: "1px solid #999", fontSize: "10px" }}>
                  <div style={{ padding: "8px", borderRight: "1px solid #999" }}><strong>DATE</strong><br />{formatDate(formData?.date)}</div>
                  <div style={{ padding: "8px" }}><strong>QUOTATION VALID UNTIL</strong><br />{formatDate(formData?.validUntil)}</div>
                  <div style={{ padding: "8px", borderTop: "1px solid #999", borderRight: "1px solid #999" }}><strong>BILL TO</strong><br />{formData?.customerName || "—"}</div>
                  <div style={{ padding: "8px", borderTop: "1px solid #999" }}><strong>CUSTOMER ID</strong><br />{formData?.customerId || "—"}</div>
                  <div style={{ padding: "8px", borderTop: "1px solid #999", gridColumn: "1 / -1" }}><strong>PREPARED BY</strong><br />{formData?.preparedBy || "—"}</div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "10px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#eee", borderTop: "1px solid #111", borderBottom: "1px solid #111" }}>
                      {[
                        ["DESCRIPTION", "46%", "left"],
                        ["QTY", "10%", "center"],
                        ["UNIT", "10%", "center"],
                        ["RATE", "16%", "right"],
                        ["AMOUNT", "18%", "right"],
                      ].map(([label, width, align]) => (
                        <th key={label} style={{ padding: "8px", textAlign: align, width, fontSize: "9px" }}>{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {watchedItems.map((item, index) => (
                      <tr key={fields[index]?.id || index} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: "7px 8px", verticalAlign: "top", overflowWrap: "anywhere" }}>{item?.description || "—"}</td>
                        <td style={{ padding: "7px 8px", textAlign: "center", verticalAlign: "top" }}>{item?.quantity || "—"}</td>
                        <td style={{ padding: "7px 8px", textAlign: "center", verticalAlign: "top" }}>{item?.unit || "—"}</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", verticalAlign: "top" }}>{formatCurrency(item?.rate)}</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", verticalAlign: "top", fontWeight: 600 }}>{formatCurrency(calculateItemAmount(item))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "18px" }}>
                  <div style={{ width: "280px", borderTop: "2px solid #111", borderBottom: "2px solid #111", padding: "10px 0", fontSize: "11px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}><span>SUBTOTAL</span><span>KSh {formatCurrency(subtotal)}</span></div>
                    {discountAmount > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}><span>DISCOUNT</span><span>− KSh {formatCurrency(discountAmount)}</span></div>}
                    {taxAmount > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}><span>TAX ({Number(formData?.taxRate) || 0}%)</span><span>KSh {formatCurrency(taxAmount)}</span></div>}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: "14px", fontWeight: 800 }}><span>TOTAL</span><span>KSh {formatCurrency(total)}</span></div>
                  </div>
                </div>

                {formData?.notes && (
                  <div style={{ marginTop: "24px", fontSize: "10px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    <strong>NOTES / SCOPE OF WORK</strong><br />{formData.notes}
                  </div>
                )}

                <div style={{ marginTop: "30px", fontSize: "10px", lineHeight: 1.7 }}>
                  <strong>Payment terms: </strong>{formData?.paymentTerms || "—"}<br />
                  <strong>Pay Bill:</strong> {COMPANY.paybill} &nbsp; <strong>A/c No:</strong> {COMPANY.account}
                </div>

                <div style={{ marginTop: "40px", paddingTop: "12px", borderTop: "1px solid #aaa", textAlign: "center", fontSize: "10px" }}>
                  If you have any questions concerning this quotation, please reach out to {COMPANY.contactName}.<br />
                  TEL: {COMPANY.contactPhone}
                </div>
                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "15px", fontWeight: 800 }}>THANK YOU FOR YOUR BUSINESS!</div>
                <div style={{ marginTop: "5px", textAlign: "center", fontSize: "9px", color: "#555" }}>Due upon receipt</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}