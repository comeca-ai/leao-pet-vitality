
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Package, AlertTriangle } from "lucide-react";

interface ProductSelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  productPrice: number;
  maxQuantity?: number;
  stockMessage?: string;
}

const ProductSelector = ({ 
  quantity, 
  onQuantityChange, 
  productPrice,
  maxQuantity = 100,
  stockMessage
}: ProductSelectorProps) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      onQuantityChange(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      onQuantityChange(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxQuantity) {
      onQuantityChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 1) {
      setInputValue("1");
      onQuantityChange(1);
    } else if (numValue > maxQuantity) {
      setInputValue(maxQuantity.toString());
      onQuantityChange(maxQuantity);
    }
  };

  const isQuantityValid = quantity <= maxQuantity && quantity >= 1;
  const isStockLow = maxQuantity <= 10;

  return (
    <Card className="border-earth-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-earth-50 to-leaf-50">
        <CardTitle className="text-earth-800 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Selecione a Quantidade
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-center">
          {/* Imagem do produto */}
          <div className="bg-gradient-to-br from-earth-200 to-leaf-200 rounded-xl p-6 w-48 h-56 flex items-center justify-center mr-8">
            <div className="text-center">
              <div className="w-16 h-20 bg-earth-500 rounded-lg mx-auto mb-3 shadow-lg"></div>
              <h3 className="text-earth-700 font-bold text-lg">Juba de Leão</h3>
              <p className="text-earth-600 text-sm">Para Pets - 30ml</p>
              <p className="text-earth-800 font-semibold text-lg mt-2">
                R$ {productPrice.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>

          {/* Controles de quantidade */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Quantidade
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <Input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onBlur={handleInputBlur}
                  className="w-20 text-center"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleIncrease}
                  disabled={quantity >= maxQuantity}
                  className="h-10 w-10 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Informações de estoque */}
            <div className="space-y-2">
              {stockMessage && (
                <div className={`flex items-center gap-2 text-sm ${
                  isQuantityValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {!isQuantityValid && <AlertTriangle className="w-4 h-4" />}
                  <span>{stockMessage}</span>
                </div>
              )}
              
              {isStockLow && maxQuantity > 0 && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Estoque limitado! Apenas {maxQuantity} unidades disponíveis</span>
                </div>
              )}
            </div>

            {/* Subtotal */}
            <div className="bg-earth-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-earth-600">Subtotal:</span>
                <span className="text-earth-800 font-bold text-lg">
                  R$ {(productPrice * quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelector;
