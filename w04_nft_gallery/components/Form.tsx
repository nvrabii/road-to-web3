import { Dispatch, SetStateAction } from "react";

type FormType = {
  wallet: string;
  collection: string;
};

type FormProps = {
  form: FormType;
  setForm: Dispatch<SetStateAction<FormType>>;
  onFormSubmit: Function;
};

function Form({ form, setForm, onFormSubmit }: FormProps) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg p-4 border rounded mb-8 flex justify-center flex-col">
        <div className="text-lg font-medium text-center mb-4">
          Explore NFT Collections
        </div>

        <input
          className="block border mb-4 p-1 rounded w-full"
          type="text"
          name="wallet"
          placeholder="Account address"
          onChange={(e) => {
            setForm({ ...form, wallet: e.target.value });
            e.preventDefault();
          }}
          value={form.wallet}
        />

        <input
          className="block border mb-4 p-1 rounded w-full"
          type="text"
          name="collection"
          placeholder="Collection address"
          onChange={(e) => {
            setForm({ ...form, collection: e.target.value });
            e.preventDefault();
          }}
          value={form.collection}
        />

        <button
          className="block button text-white bg-teal-400 px-4 py-2 rounded hover:bg-teal-500 active:bg-teal-400"
          onClick={(e) => {
            onFormSubmit();
            e.preventDefault();
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default Form;
