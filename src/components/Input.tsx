interface InputFieldProps {
  id: string;
  label?: string;
  type: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: string;
}

export default function Input({
  id,
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  variant,
}: InputFieldProps) {
  return (
    <div className="w-full flex flex-col space-y-1">
      <label htmlFor={id}>
        {label}
        {name === "promo" ? null : <span className="-mt-1 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        autoComplete="off"
        // required
        className="p-1.5 outline-none"
      />
      {type === "password" && variant === "login" ? (
        <span className="text-xs cursor-pointer">Mot de passe oublié ?</span>
      ) : null}
    </div>
  );
}
