
import { Input } from "@/components/ui/input";

const ContactAddressForm = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-earth-800 mb-4">
        1. Dados de contato e endereço
      </h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Input placeholder="Nome completo" className="border-earth-300" />
          </div>
          <div>
            <Input placeholder="Telefone" className="border-earth-300" />
          </div>
        </div>
        <div>
          <Input placeholder="E-mail" className="border-earth-300" />
        </div>
        <div>
          <Input placeholder="Endereço" className="border-earth-300" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Input placeholder="Cidade" className="border-earth-300" />
          </div>
          <div>
            <Input placeholder="CEP" className="border-earth-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAddressForm;
