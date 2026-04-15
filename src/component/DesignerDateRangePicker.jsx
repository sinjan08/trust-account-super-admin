import { useEffect, useRef } from "react";

const DesignerDateRangePicker = ({ onApply, onCancel, placeholder }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.$ || !window.$.fn.daterangepicker) return;

    const $ = window.$;
    const input = $(inputRef.current);

    input.daterangepicker(
      {
        autoUpdateInput: false,
        locale: { cancelLabel: "Clear" },
      },
      (start, end) => {
        input.val(`${start.format("MM/DD/YYYY")} - ${end.format("MM/DD/YYYY")}`);
      }
    );


    const handleApply = (ev, picker) => {
      if (onApply) onApply([picker.startDate.toDate(), picker.endDate.toDate()]);
      input.val(`${picker.startDate.format("MM/DD/YYYY")} - ${picker.endDate.format("MM/DD/YYYY")}`);
    };


    const handleCancel = () => {
      if (onCancel) onCancel();
      input.val("");
    };

    input.on("apply.daterangepicker", handleApply);
    input.on("cancel.daterangepicker", handleCancel);

    return () => {
      input.data("daterangepicker")?.remove();
    };
  }, [onApply, onCancel]);
  return (
    <label className="daterange-btn">
      <img src="/images/filter-icons/date.svg" alt="" />
      <input
        type="text"
        readOnly
        className="input"
        name="datefilter"
        placeholder={placeholder || "Sign Up Date Range"}
        ref={inputRef}
      />
    </label>
  );
};

export default DesignerDateRangePicker;
