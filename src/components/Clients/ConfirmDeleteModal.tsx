import React from "react";
import type { Cliente } from "../../types";

interface ConfirmDeleteModalProps {
  open: boolean;
  cliente: Cliente | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  cliente,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  if (!open || !cliente) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/90 bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Confirmar exclusão
        </h2>
        <p className="mb-4 text-gray-600">
          Tem certeza que deseja excluir o cliente{" "}
          <span className="font-bold">{cliente.nomeCompleto}</span>? Essa ação
          não poderá ser desfeita.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Excluindo..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
