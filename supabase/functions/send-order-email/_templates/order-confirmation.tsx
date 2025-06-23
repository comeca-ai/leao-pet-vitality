
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface OrderConfirmationEmailProps {
  customerName: string
  orderNumber: string
  orderTotal: number
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  customerEmail: string
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  orderTotal,
  orderItems,
  customerEmail,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirmação do seu pedido #{orderNumber} - Juba de Leão</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>✅ Pedido Confirmado!</Heading>
        
        <Text style={text}>
          Olá {customerName},
        </Text>
        
        <Text style={text}>
          Obrigado pela sua compra! Seu pedido foi confirmado e está sendo processado.
        </Text>

        <Section style={orderBox}>
          <Text style={orderTitle}>Pedido #{orderNumber}</Text>
          <Text style={orderSubtitle}>Para: {customerEmail}</Text>
          
          <Hr style={hr} />
          
          {orderItems.map((item, index) => (
            <Row key={index} style={itemRow}>
              <Column style={itemName}>
                <Text style={itemText}>{item.name}</Text>
                <Text style={itemQuantity}>Quantidade: {item.quantity}</Text>
              </Column>
              <Column style={itemPrice}>
                <Text style={itemText}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
              </Column>
            </Row>
          ))}
          
          <Hr style={hr} />
          
          <Row style={totalRow}>
            <Column>
              <Text style={totalText}>Total: R$ {orderTotal.toFixed(2).replace('.', ',')}</Text>
            </Column>
          </Row>
        </Section>

        <Section style={nextStepsBox}>
          <Heading style={h2}>📦 Próximos Passos</Heading>
          
          <Text style={stepText}>
            <strong>1. Processamento:</strong> Seu pedido será processado em até 2 dias úteis.
          </Text>
          
          <Text style={stepText}>
            <strong>2. Envio:</strong> Você receberá o código de rastreamento por e-mail.
          </Text>
          
          <Text style={stepText}>
            <strong>3. Entrega:</strong> O produto chegará em 5-7 dias úteis após o envio.
          </Text>
        </Section>

        <Text style={supportText}>
          Dúvidas? Entre em contato conosco pelo WhatsApp: (11) 99999-9999
        </Text>

        <Text style={footer}>
          Juba de Leão para Pets<br />
          O melhor cuidado natural para seu pet
        </Text>
      </Container>
    </Body>
  </Html>
)

export default OrderConfirmationEmail

const main = {
  backgroundColor: '#f6f9fc',
  padding: '20px 0',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '8px',
  margin: '0 auto',
  padding: '40px',
  maxWidth: '600px',
}

const h1 = {
  color: '#2c5530',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#2c5530',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
}

const text = {
  color: '#333333',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 15px 0',
}

const orderBox = {
  backgroundColor: '#f8fdf9',
  border: '2px solid #e8f5e8',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const orderTitle = {
  color: '#2c5530',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 5px 0',
}

const orderSubtitle = {
  color: '#666666',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '14px',
  margin: '0 0 15px 0',
}

const hr = {
  border: 'none',
  borderTop: '1px solid #e8f5e8',
  margin: '15px 0',
}

const itemRow = {
  margin: '10px 0',
}

const itemName = {
  verticalAlign: 'top' as const,
}

const itemPrice = {
  textAlign: 'right' as const,
  verticalAlign: 'top' as const,
}

const itemText = {
  color: '#333333',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '14px',
  margin: '0',
}

const itemQuantity = {
  color: '#666666',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '12px',
  margin: '2px 0 0 0',
}

const totalRow = {
  margin: '15px 0 0 0',
}

const totalText = {
  color: '#2c5530',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'right' as const,
}

const nextStepsBox = {
  backgroundColor: '#fff7ed',
  border: '2px solid #fed7aa',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const stepText = {
  color: '#333333',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 10px 0',
}

const supportText = {
  color: '#666666',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '30px 0 20px 0',
  textAlign: 'center' as const,
}

const footer = {
  color: '#999999',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '30px 0 0 0',
  textAlign: 'center' as const,
}
