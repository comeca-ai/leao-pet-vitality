
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductSelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductSelector = ({ quantity, onQuantityChange }: ProductSelectorProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-earth-800 mb-4">
        2. Produto e quantidade
      </h2>
      <div className="flex items-start gap-6">
        <div className="bg-gradient-to-br from-earth-200 to-leaf-200 rounded-xl p-4 w-24 h-32 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-12 bg-earth-500 rounded-lg mx-auto mb-1 shadow-lg"></div>
            <p className="text-earth-700 font-medium text-xs">Juba de Leão</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-earth-800 font-medium mb-2">Juba de Leão para Pets</p>
          <div className="flex items-center gap-3">
            <Label className="text-earth-700">Quantidade:</Label>
            <Input 
              type="number" 
              min="1" 
              value={quantity} 
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
              className="w-20 border-earth-300" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;
