import React, { useMemo, useRef } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COMPANY = {
  name: "BLUEWAVE",
  subtitle: "PLUMBERS",
  tagline: "Your allround plumbing partner",
  address: "Maasai Lodge Rd, Next to NIBS, Rongai",
  phone: "(+254) 797-965-768",
  paybill: "714888",
  account: "415225",
};

const defaultItem = {
  description: "",
  quantity: 1,
  unit: "Pcs",
  rate: "",
};

const defaultValues = {
  quotationNumber: "100-003-R",
  date: new Date().toISOString().split("T")[0],
  validUntil: "",
  customerName: "Walk-In Customer",
  customerId: "",
  preparedBy: "",
  paymentTerms: "CASH BASIS",
  items: [defaultItem],
};

function formatCurrency(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateItemAmount(item) {
  const quantity = Number(item?.quantity) || 0;
  const rate = Number(item?.rate) || 0;

  return quantity * rate;
}

export default function QuotationForm() {
  const previewRef = useRef(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({
    control,
    name: "items",
  });

  const formData = useWatch({
    control,
  });

  const total = useMemo(() => {
    return (watchedItems || []).reduce(
      (sum, item) => sum + calculateItemAmount(item),
      0
    );
  }, [watchedItems]);

  const addItem = () => {
    append({
      ...defaultItem,
    });
  };

  const handleQuantityChange = (index, value) => {
    const quantity = Math.max(0, Number(value) || 0);
    setValue(`items.${index}.quantity`, quantity);
  };

  const handleRateChange = (index, value) => {
    const rate = Math.max(0, Number(value) || 0);
    setValue(`items.${index}.rate`, rate);
  };

  const downloadPDF = async () => {
    if (!previewRef.current) {
      return;
    }

    const element = previewRef.current;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const margin = 8;

      const availableWidth = pageWidth - margin * 2;

      const imageHeight =
        (canvas.height * availableWidth) / canvas.width;

      /*
       * The quotation is designed to fit on one A4 page.
       *
       * If the content becomes too tall, scale it down
       * proportionally rather than creating a second page.
       */
      let finalWidth = availableWidth;
      let finalHeight = imageHeight;

      const maxHeight = pageHeight - margin * 2;

      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth =
          (canvas.width * finalHeight) / canvas.height;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = margin;

      pdf.addImage(
        imageData,
        "PNG",
        x,
        y,
        finalWidth,
        finalHeight
      );

      const quotationNumber =
        formData?.quotationNumber || "quotation";

      pdf.save(`quotation-${quotationNumber}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Unable to generate the quotation PDF.");
    }
  };

  const onSubmit = async () => {
    /*
     * The quotation is already kept in React Hook Form state.
     *
     * At this stage we only generate the PDF.
     * You can later add an API call here if you want
     * to save quotations to your backend.
     */
    await downloadPDF();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Quotation
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Fill in the quotation details, preview it, then
            download it as a PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[480px_1fr]">
          {/* =====================================================
              FORM
          ====================================================== */}

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Quotation information */}

              <section>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Quotation Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Quotation No.
                    </label>

                    <input
                      {...register("quotationNumber", {
                        required: "Quotation number is required",
                      })}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />

                    {errors.quotationNumber && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.quotationNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Date
                    </label>

                    <input
                      type="date"
                      {...register("date", {
                        required: "Date is required",
                      })}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Valid Until
                    </label>

                    <input
                      type="date"
                      {...register("validUntil")}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Customer ID
                    </label>

                    <input
                      {...register("customerId")}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </section>

              <hr className="my-6" />

              {/* Customer */}

              <section>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Customer
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Bill To
                    </label>

                    <input
                      {...register("customerName", {
                        required: "Customer name is required",
                      })}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />

                    {errors.customerName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Prepared By
                    </label>

                    <input
                      {...register("preparedBy", {
                        required: "Prepared by is required",
                      })}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="e.g. Benard Chunga"
                    />
                  </div>
                </div>
              </section>

              <hr className="my-6" />

              {/* Items */}

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Items
                  </h2>

                  <button
                    type="button"
                    onClick={addItem}
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => {
                    const item = watchedItems?.[index];

                    const amount = calculateItemAmount(item);

                    return (
                      <div
                        key={field.id}
                        className="rounded-lg border bg-gray-50 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            Item {index + 1}
                          </span>

                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium">
                              Description
                            </label>

                            <input
                              {...register(
                                `items.${index}.description`,
                                {
                                  required:
                                    "Description is required",
                                }
                              )}
                              className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                              placeholder="e.g. Danco PPR Pipe 25 mm"
                            />

                            {errors.items?.[index]?.description && (
                              <p className="mt-1 text-xs text-red-600">
                                {
                                  errors.items[index].description
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium">
                                Qty
                              </label>

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item?.quantity ?? ""}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-xs font-medium">
                                Unit
                              </label>

                              <input
                                {...register(
                                  `items.${index}.unit`
                                )}
                                className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                                placeholder="Pcs"
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-xs font-medium">
                                Rate (Ksh)
                              </label>

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item?.rate ?? ""}
                                onChange={(e) =>
                                  handleRateChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                              />
                            </div>
                          </div>

                          <div className="text-right text-sm font-semibold">
                            Amount: Ksh{" "}
                            {formatCurrency(amount)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <hr className="my-6" />

              {/* Payment */}

              <section>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Payment
                </h2>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Payment Terms
                  </label>

                  <input
                    {...register("paymentTerms")}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              </section>

              {/* Total */}

              <div className="mt-6 rounded-lg bg-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    Ksh {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Actions */}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Download PDF
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Generate PDF
                </button>
              </div>
            </form>
          </div>

          {/* =====================================================
              PREVIEW
          ====================================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Preview
              </h2>

              <button
                type="button"
                onClick={downloadPDF}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Download PDF
              </button>
            </div>

            <div className="overflow-auto rounded-xl bg-gray-300 p-4 shadow-inner">
              <div
                ref={previewRef}
                className="mx-auto bg-white text-black"
                style={{
                  width: "794px",
                  minHeight: "1123px",
                  padding: "32px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                {/* Header */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "2px solid #111",
                    paddingBottom: "14px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: "800",
                        letterSpacing: "1px",
                      }}
                    >
                      {COMPANY.name}
                    </div>

                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: "800",
                        letterSpacing: "1px",
                      }}
                    >
                      {COMPANY.subtitle}
                    </div>

                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "11px",
                        color: "#444",
                      }}
                    >
                      {COMPANY.tagline}
                    </div>

                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "10px",
                        lineHeight: "1.5",
                      }}
                    >
                      {COMPANY.address}
                      <br />
                      Phone: {COMPANY.phone}
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        letterSpacing: "1px",
                      }}
                    >
                      QUOTATION
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "11px",
                      }}
                    >
                      No.{" "}
                      <strong>
                        {formData?.quotationNumber || ""}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Metadata */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0",
                    marginTop: "18px",
                    border: "1px solid #999",
                    fontSize: "10px",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      borderRight: "1px solid #999",
                    }}
                  >
                    <strong>DATE</strong>
                    <br />
                    {formatDate(formData?.date)}
                  </div>

                  <div
                    style={{
                      padding: "8px",
                    }}
                  >
                    <strong>QUOTATION VALID UNTIL</strong>
                    <br />
                    {formatDate(formData?.validUntil)}
                  </div>

                  <div
                    style={{
                      padding: "8px",
                      borderTop: "1px solid #999",
                      borderRight: "1px solid #999",
                    }}
                  >
                    <strong>BILL TO</strong>
                    <br />
                    {formData?.customerName || ""}
                  </div>

                  <div
                    style={{
                      padding: "8px",
                      borderTop: "1px solid #999",
                    }}
                  >
                    <strong>CUSTOMER ID</strong>
                    <br />
                    {formData?.customerId || ""}
                  </div>

                  <div
                    style={{
                      padding: "8px",
                      borderTop: "1px solid #999",
                      gridColumn: "1 / -1",
                    }}
                  >
                    <strong>PREPARED BY</strong>
                    <br />
                    {formData?.preparedBy || ""}
                  </div>
                </div>

                {/* Items table */}

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                    fontSize: "10px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#eeeeee",
                        borderTop: "1px solid #111",
                        borderBottom: "1px solid #111",
                      }}
                    >
                      <th
                        style={{
                          padding: "8px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        DESCRIPTION
                      </th>

                      <th
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          width: "12%",
                        }}
                      >
                        QTTY
                      </th>

                      <th
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          width: "12%",
                        }}
                      >
                        UNIT
                      </th>

                      <th
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          width: "13%",
                        }}
                      >
                        RATE
                      </th>

                      <th
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          width: "13%",
                        }}
                      >
                        AMOUNT
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {(watchedItems || []).map((item, index) => {
                      const amount = calculateItemAmount(item);

                      return (
                        <tr
                          key={fields[index]?.id || index}
                          style={{
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <td
                            style={{
                              padding: "7px 8px",
                              verticalAlign: "top",
                            }}
                          >
                            {item?.description || ""}
                          </td>

                          <td
                            style={{
                              padding: "7px 8px",
                              textAlign: "center",
                              verticalAlign: "top",
                            }}
                          >
                            {item?.quantity || ""}
                          </td>

                          <td
                            style={{
                              padding: "7px 8px",
                              textAlign: "center",
                              verticalAlign: "top",
                            }}
                          >
                            {item?.unit || ""}
                          </td>

                          <td
                            style={{
                              padding: "7px 8px",
                              textAlign: "right",
                              verticalAlign: "top",
                            }}
                          >
                            {formatCurrency(item?.rate)}
                          </td>

                          <td
                            style={{
                              padding: "7px 8px",
                              textAlign: "right",
                              verticalAlign: "top",
                              fontWeight: "600",
                            }}
                          >
                            {formatCurrency(amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Total */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "18px",
                  }}
                >
                  <div
                    style={{
                      width: "280px",
                      borderTop: "2px solid #111",
                      borderBottom: "2px solid #111",
                      padding: "10px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      fontWeight: "800",
                    }}
                  >
                    <span>TOTAL</span>

                    <span>
                      Ksh {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Payment */}

                <div
                  style={{
                    marginTop: "30px",
                    fontSize: "10px",
                    lineHeight: "1.7",
                  }}
                >
                  <strong>
                    Payment terms:{" "}
                  </strong>
                  {formData?.paymentTerms || ""}
                </div>

                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "10px",
                    lineHeight: "1.7",
                  }}
                >
                  <strong>Pay Bill:</strong> B/s No.:{" "}
                  {COMPANY.paybill}
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    lineHeight: "1.7",
                  }}
                >
                  <strong>A/c No:</strong> {COMPANY.account}
                </div>

                {/* Footer */}

                <div
                  style={{
                    marginTop: "40px",
                    paddingTop: "12px",
                    borderTop: "1px solid #aaa",
                    textAlign: "center",
                    fontSize: "10px",
                  }}
                >
                  If you have any questions concerning this
                  quotation, please reach out to Benard
                  <br />
                  TEL: 0789163456
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    fontSize: "15px",
                    fontWeight: "800",
                  }}
                >
                  THANK YOU FOR YOUR BUSINESS!
                </div>

                <div
                  style={{
                    marginTop: "5px",
                    textAlign: "center",
                    fontSize: "9px",
                    color: "#555",
                  }}
                >
                  Due upon receipt
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
