export default function DynamicForm({ fields, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nama Lengkap" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="No HP" />

      {fields.map((field) => (
        <div key={field.id}>
          <label>{field.label}</label>

          {field.type === "textarea" && (
            <textarea name={field.name} required={field.required} />
          )}

          {field.type === "file" && (
            <input type="file" name={field.name} required={field.required} />
          )}

          {field.type === "text" && (
            <input type="text" name={field.name} required={field.required} />
          )}
        </div>
      ))}

      <button type="submit">Kirim Lamaran</button>
    </form>
  );
}
