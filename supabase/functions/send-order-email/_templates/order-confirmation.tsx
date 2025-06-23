
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Button,
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
  emailType?: 'confirmation' | 'payment_success' | 'payment_failed' | 'whatsapp_created'
  whatsappLink?: string
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  orderTotal,
  orderItems,
  emailType = 'confirmation',
  whatsappLink,
}: OrderConfirmationEmailProps) => {
  const getTitle = () => {
    switch (emailType) {
      case 'payment_success':
        return '✅ Pagamento Confirmado!'
      case 'payment_failed':
        return '❌ Problema no Pagamento'
      case 'whatsapp_created':
        return '📱 Pedido via WhatsApp Criado'
      default:
        return '🛒 Pedido Confirmado!'
    }
  }

  const getMessage = () => {
    switch (emailType) {
      case 'payment_success':
        return 'Seu pagamento foi processado com sucesso! Seu pedido será preparado e enviado em breve.'
      case 'payment_failed':
        return 'Houve um problema com seu pagamento. Entre em contato conosco para resolver.'
      case 'whatsapp_created':
        return 'Recebemos sua solicitação via WhatsApp. Nossa equipe entrará em contato em breve para finalizar seu pedido.'
      default:
        return 'Obrigado por sua compra! Seu pedido foi recebido e está sendo processado.'
    }
  }

  return (
    <Html>
      <Head />
      <Preview>{getTitle()} - Pedido #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{getTitle()}</Heading>
          
          <Text style={text}>Olá {customerName},</Text>
          
          <Text style={text}>{getMessage()}</Text>
          
          <Section style={orderBox}>
            <Heading style={h2}>Detalhes do Pedido #{orderNumber}</Heading>
            
            {orderItems.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemColumn}>
                  <Text style={itemText}>{item.name}</Text>
                  <Text style={itemSubtext}>Quantidade: {item.quantity}</Text>
                </Column>
                <Column style={priceColumn}>
                  <Text style={priceText}>
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </Text>
                </Column>
              </Row>
            ))}
            
            <Row style={totalRow}>
              <Column>
                <Text style={totalText}>Total: R$ {orderTotal.toFixed(2).replace('.', ',')}</Text>
              </Column>
            </Row>
          </Section>

          {emailType === 'whatsapp_created' && whatsappLink && (
            <Section style={whatsappSection}>
              <Text style={text}>
                Para finalizar seu pedido, clique no botão abaixo para continuar no WhatsApp:
              </Text>
              <Button style={whatsappButton} href={whatsappLink}>
                Continuar no WhatsApp
              </Button>
            </Section>
          )}

          {emailType === 'payment_success' && (
            <Section style={successSection}>
              <Text style={text}>
                <strong>Próximos passos:</strong>
              </Text>
              <Text style={text}>
                • Seu pedido será preparado em até 2 dias úteis<br />
                • Você receberá o código de rastreamento por email<br />
                • Prazo de entrega: 5-10 dias úteis
              </Text>
            </Section>
          )}

          <Section style={contactSection}>
            <Text style={text}>
              <strong>Precisa de ajuda?</strong><br />
              WhatsApp: (11) 99999-9999<br />
              Email: contato@jubadeleaopets.com
            </Text>
          </Section>

          <Text style={footer}>
            Atenciosamente,<br />
            Equipe Juba de Leão para Pets
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
}

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
}

const orderBox = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const itemRow = {
  borderBottom: '1px solid #e9ecef',
  paddingBottom: '10px',
  marginBottom: '10px',
}

const itemColumn = {
  width: '70%',
}

const priceColumn = {
  width: '30%',
  textAlign: 'right' as const,
}

const itemText = {
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
}

const itemSubtext = {
  color: '#666',
  fontSize: '12px',
  margin: '4px 0 0 0',
}

const priceText = {
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
}

const totalRow = {
  borderTop: '2px solid #333',
  paddingTop: '10px',
  marginTop: '10px',
}

const totalText = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  margin: '0',
}

const whatsappSection = {
  backgroundColor: '#e8f5e8',
  border: '1px solid #4caf50',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  textAlign: 'center' as const,
}

const whatsappButton = {
  backgroundColor: '#25d366',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '10px auto',
}

const successSection = {
  backgroundColor: '#e8f5e8',
  border: '1px solid #4caf50',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const contactSection = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '40px 0 0 0',
}

export default OrderConfirmationEmail
