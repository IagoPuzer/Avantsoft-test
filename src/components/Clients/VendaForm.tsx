import React from "react";
import { useForm } from "react-hook-form";
import { FiDollarSign, FiCalendar, FiX, FiSave } from "react-icons/fi";

interface VendaFormData {
  data: string;
  valor: number;
}

interface VendaFormProps {
  clienteNome: string;
  onSubmit: (data: VendaFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const VendaForm: React.FC<VendaFormProps> = ({
  clienteNome,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VendaFormData>({
    defaultValues: {
      data: new Date().toISOString().split("T")[0], // Data atual
      valor: 0,
    },
  });

  const handleFormSubmit = (data: VendaFormData) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-slate-500/90 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Adicionar Venda
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Cliente:{" "}
              <span className="font-medium text-gray-900">{clienteNome}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="data"
                className="block text-sm font-medium text-gray-700"
              >
                Data da Venda
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("data", {
                    required: "Data é obrigatória",
                    validate: (value) => {
                      const date = new Date(value);
                      const today = new Date();
                      if (date > today) {
                        return "Data não pode ser no futuro";
                      }
                      return true;
                    },
                  })}
                  type="date"
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
              {errors.data && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.data.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="valor"
                className="block text-sm font-medium text-gray-700"
              >
                Valor da Venda
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("valor", {
                    required: "Valor é obrigatório",
                    min: {
                      value: 0.01,
                      message: "Valor deve ser maior que zero",
                    },
                    valueAsNumber: true,
                  })}
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="0,00"
                />
              </div>
              {errors.valor && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.valor.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <FiSave className="mr-2 h-4 w-4" />
                {loading ? "Salvando..." : "Adicionar Venda"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendaForm;
