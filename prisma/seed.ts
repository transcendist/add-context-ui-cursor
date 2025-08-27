import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const documents = [
    // ADC Components
    {
      title: 'AD4081',
      content: 'AD4081 - 20-Bit, 20 MSPS, Differential SAR ADC. High-precision analog-to-digital converter featuring 20-bit resolution and 20 megasample per second sampling rate with differential input architecture for superior noise performance.',
    },
    {
      title: 'AD4084',
      content: 'AD4084 - 16-Bit, 20 MSPS, Differential SAR ADC. Precision analog-to-digital converter with 16-bit resolution and 20 MSPS sampling rate, designed for high-performance data acquisition applications.',
    },
    {
      title: 'AD4080',
      content: 'AD4080 - 20-Bit, 40 MSPS, Differential SAR ADC. Ultra-high precision ADC combining 20-bit resolution with 40 MSPS sampling rate for demanding measurement and instrumentation applications.',
    },
    {
      title: 'AD9207',
      content: 'AD9207 - 12-Bit, 6 GSPS, JESD204B/JESD204C Dual ADC. High-speed dual channel ADC with 12-bit resolution and 6 gigasample per second rate, featuring JESD204B/C serial interface for RF and communications applications.',
    },
    {
      title: 'LTM2173-14',
      content: 'LTM2173-14 - 14-Bit, 80Msps Low Power Quad ADC. Quad-channel 14-bit ADC module with 80 MSPS sampling rate and optimized low power consumption for multi-channel data acquisition systems.',
    },
    {
      title: 'ADE9112',
      content: 'ADE9112 - Isolated, Sigma-Delta ADCs with SPI. Dual-channel isolated sigma-delta ADC designed for energy measurement applications with SPI digital interface and galvanic isolation.',
    },
    {
      title: 'ADUM7704',
      content: 'ADUM7704 - 16-Bit, Isolated, Sigma-Delta Modulator. 16-bit isolated sigma-delta modulator providing galvanic isolation for precision measurement applications in harsh industrial environments.',
    },
    {
      title: 'ADE7912',
      content: 'ADE7912 - 2-Channel, Isolated, Sigma Delta ADC with SPI. Dual-channel isolated sigma-delta ADC with SPI interface, specifically designed for power and energy measurement applications.',
    },
    {
      title: 'ADE7913',
      content: 'ADE7913 - 3-Channel, Isolated, Sigma Delta ADC with SPI. Triple-channel isolated sigma-delta ADC featuring SPI communication interface for multi-phase power monitoring and energy measurement systems.',
    },
    // Orders
    {
      title: 'Order Number: 7F2K-93A1',
      content: 'Customer: Global Tech Inc. Items: 500x AD4081, 250x AD9207.',
    },
    {
      title: 'Order Number: Q5L9-8Z7C',
      content: 'Customer: Global Tech Inc. Items: 1200x ADE7913.',
    },
    {
      title: 'Order Number: 2M8X-6P4B',
      content: 'Customer: Global Tech Inc. Items: 300x ADUM7704, 150x LTM2173-14. Signed by: J. Doe.',
    },
    {
      title: 'Order Number: H3D7-1K9R',
      content: 'Customer: Global Tech Inc. Items: 800x AD4080.',
    },
    {
      title: 'Order Number: 9T6V-5E2N',
      content: 'Customer: Global Tech Inc. Items: 2500x ADE912. Invoice #: INV-2023-456.',
    },
    {
      title: 'Order Number: C8J1-4W7Q',
      content: 'Customer: Global Tech Inc. Items: 750x AD4084.',
    },
    {
      title: 'Order Number: 5R9M-2Y8L',
      content: 'Customer: Global Tech Inc. Items: 100x AD9207.',
    },
    {
      title: 'Order Number: N7B3-0Q6X',
      content: 'Customer: Global Tech Inc. Items: 400x ADE7912.',
    },
    {
      title: 'Order Number: 4P6C-9H2D',
      content: 'Customer: Global Tech Inc. Items: 600x AD4081. Signed by: A. Smith.',
    },
    {
      title: 'Order Number: X1Z8-3L5K',
      content: 'Customer: Global Tech Inc. Items: 900x LTM2173-14.',
    },
    {
      title: 'Order Number: 6E4N-7T2V',
      content: 'Customer: Global Tech Inc. Items: 1500x ADE7913.',
    },
    {
      title: 'Order Number: B2Q7-8M9S',
      content: 'Customer: Global Tech Inc. Items: 200x ADUM7704.',
    },
  ]

  for (const doc of documents) {
    await prisma.document.upsert({
      where: { title: doc.title },
      update: {},
      create: doc,
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
