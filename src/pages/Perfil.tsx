import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Package, Loader2, ArrowLeft } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAddresses, useCreateAddress } from "@/hooks/useAddresses";
import { useOrders } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
  });

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const updateProfile = useUpdateProfile();
  const createAddress = useCreateAddress();
  const { toast } = useToast();

  // Atualizar formData quando o profile for carregado
  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || "",
        telefone: profile.telefone || "",
      });
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile.mutateAsync(formData);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'iniciado': 'bg-gray-100 text-gray-800',
      'aguardando_pagamento': 'bg-yellow-100 text-yellow-800',
      'pago': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800',
      'whatsapp': 'bg-blue-100 text-blue-800'
    };

    const statusText = {
      'iniciado': 'Iniciado',
      'aguardando_pagamento': 'Aguardando Pagamento',
      'pago': 'Pago',
      'cancelado': 'Cancelado',
      'whatsapp': 'WhatsApp'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[status as keyof typeof statusMap] || statusMap.iniciado}`}>
        {statusText[status as keyof typeof statusText] || status}
      </span>
    );
  };

  const getPaymentMethodDisplay = (paymentMethod: string | null | undefined) => {
    if (!paymentMethod) return 'Não informado';
    
    const paymentMethods = {
      'pix': 'PIX',
      'cartao': 'Cartão de Crédito', 
      'boleto': 'Boleto Bancário',
      'whatsapp': 'WhatsApp'
    };
    
    return paymentMethods[paymentMethod as keyof typeof paymentMethods] || paymentMethod.toUpperCase();
  };

  if (profileLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-cream-50 to-earth-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-leaf-600" />
            <p className="text-earth-600">Carregando perfil...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-earth-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header com botão voltar */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-earth-600 hover:text-leaf-600 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            <h1 className="text-3xl font-bold text-earth-700 mb-2">Meu Perfil</h1>
            <p className="text-earth-600">Gerencie suas informações pessoais, endereços e pedidos</p>
          </div>

          <Tabs defaultValue="perfil" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="perfil" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="enderecos" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Endereços</span>
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Pedidos</span>
              </TabsTrigger>
            </TabsList>

            {/* Aba Perfil */}
            <TabsContent value="perfil">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Mantenha suas informações atualizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome</Label>
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          type="submit" 
                          disabled={updateProfile.isPending}
                          className="bg-leaf-600 hover:bg-leaf-700"
                        >
                          {updateProfile.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            "Salvar"
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-earth-600">Nome</Label>
                          <p className="text-earth-800 font-medium">{profile?.nome || "Não informado"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-earth-600">E-mail</Label>
                          <p className="text-earth-800">{profile?.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-earth-600">Telefone</Label>
                          <p className="text-earth-800">{profile?.telefone || "Não informado"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-earth-600">Membro desde</Label>
                          <p className="text-earth-800">
                            {profile?.data_cadastro ? 
                              format(new Date(profile.data_cadastro), "dd/MM/yyyy", { locale: ptBR }) : 
                              "Não informado"
                            }
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setFormData({
                            nome: profile?.nome || "",
                            telefone: profile?.telefone || "",
                          });
                          setIsEditing(true);
                        }}
                        className="bg-leaf-600 hover:bg-leaf-700"
                      >
                        Editar Perfil
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Endereços */}
            <TabsContent value="enderecos">
              <Card>
                <CardHeader>
                  <CardTitle>Endereços de Entrega</CardTitle>
                  <CardDescription>
                    Gerencie seus endereços para facilitar futuras compras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {addressesLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-leaf-600" />
                      <p className="text-earth-600">Carregando endereços...</p>
                    </div>
                  ) : addresses && addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="p-4 border border-earth-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <p><span className="font-medium">Rua:</span> {address.rua}, {address.numero}</p>
                            <p><span className="font-medium">Bairro:</span> {address.bairro}</p>
                            <p><span className="font-medium">Cidade:</span> {address.cidade} - {address.estado}</p>
                            <p><span className="font-medium">CEP:</span> {address.cep}</p>
                            {address.complemento && (
                              <p><span className="font-medium">Complemento:</span> {address.complemento}</p>
                            )}
                            <p><span className="font-medium">Telefone:</span> {address.telefone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-earth-300" />
                      <p className="text-earth-600 mb-4">Nenhum endereço cadastrado</p>
                      <p className="text-earth-500 text-sm">
                        Seus endereços aparecerão aqui após o primeiro pedido
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pedidos">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Pedidos</CardTitle>
                  <CardDescription>
                    Histórico de todas as suas compras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-leaf-600" />
                      <p className="text-earth-600">Carregando pedidos...</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-earth-200 rounded-lg p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-earth-800">
                                Pedido #{order.id.slice(0, 8)}
                              </h3>
                              <p className="text-sm text-earth-600">
                                {format(new Date(order.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                            <div className="flex flex-col items-start md:items-end space-y-2">
                              {getStatusBadge(order.status)}
                              <p className="font-bold text-lg text-earth-800">
                                {formatCurrency(order.valor_total)}
                              </p>
                            </div>
                          </div>

                          {order.order_items && order.order_items.length > 0 && (
                            <div className="space-y-2">
                              <Separator />
                              <h4 className="font-medium text-earth-700 mt-4 mb-2">Itens do pedido:</h4>
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2">
                                  <div className="flex-1">
                                    <p className="font-medium text-earth-800">{item.product?.nome}</p>
                                    <p className="text-sm text-earth-600">
                                      Quantidade: {item.quantidade} x {formatCurrency(item.preco_unitario)}
                                    </p>
                                  </div>
                                  <p className="font-medium text-earth-800">
                                    {formatCurrency(item.subtotal)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t border-earth-200">
                            <p className="text-sm text-earth-600">
                              <span className="font-medium">Forma de pagamento:</span> {getPaymentMethodDisplay(order.forma_pagamento)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto mb-4 text-earth-300" />
                      <p className="text-earth-600 mb-4">Nenhum pedido encontrado</p>
                      <p className="text-earth-500 text-sm">
                        Quando você fizer seu primeiro pedido, ele aparecerá aqui
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Perfil;
