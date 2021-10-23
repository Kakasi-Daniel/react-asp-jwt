import { useField } from "formik";

function Input({label,...props}) {

  const [field,meta] = useField(props)

  return (
    <>
    <label htmlFor={props.name}>
      {label} 
    <input id={props.name} {...field} {...props} className={(meta.touched && meta.error) ? 'err' : ''}/>
    </label>
    {(meta.touched && meta.error) && <div className='err' >{meta.error}</div>}
    </>
  );
}

export default Input;