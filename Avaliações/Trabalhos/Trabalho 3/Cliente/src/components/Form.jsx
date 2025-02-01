import PropTypes from "prop-types";
import { useState } from "react";
import "../styles/Form.css"

function Form({ onSubmit, fields, buttonText, initialValues = {} }) {
    const [formData, setFormData] = useState(() =>
        Object.fromEntries(
          fields.map((field) => [
            field.name,
            initialValues[field.name] ?? (field.type === "select" ? "" : ""),
          ])
        )
      );
  

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required || false}
            >
              <option value="">Selecione...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required || false}
            />
          )}
        </div>
      ))}
      <button type="submit">{buttonText}</button>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      options: PropTypes.array,
      required: PropTypes.bool,
    })
  ).isRequired,
  buttonText: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
};

export default Form;
