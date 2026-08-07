<template>
  <div v-if="quote" class="ai-quote-bar" :key="quote.text">
    <span class="ai-quote-text">
      <span v-for="(ch, ci) in quoteChars" :key="ci" class="ai-quote-char" :style="{ animationDelay: ci * 25 + 'ms' }">{{ ch }}</span>
    </span>
    <span class="ai-quote-author" :style="{ animationDelay: quoteChars.length * 25 + 300 + 'ms' }">— {{ quote.author }}</span>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vitepress'

const quotes = [
  { text: 'What we didn\'t realize then was that the integrated circuit would reduce the cost of electronic functions by a factor of a million to one.', author: 'Jack Kilby' },
  { text: 'The integrated circuit is the heart and soul of modern electronics.', author: 'Gordon Moore' },
  { text: 'Go off and do something wonderful.', author: 'Robert Noyce' },
  { text: 'The number of transistors on a chip doubles approximately every two years.', author: 'Gordon Moore' },
  { text: 'Don\'t be encumbered by history. Go off and do something wonderful.', author: 'Robert Noyce' },
  { text: 'Listen to the technology; find out what it is telling you.', author: 'Carver Mead' },
  { text: 'If you want to go fast, go alone. If you want to go far, go together.', author: 'Marcian Hoff' },
  { text: 'Innovation comes from saying no to 1,000 things.', author: 'Steve Jobs' },
  { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Invention is the most important product of man\'s creative brain.', author: 'Nikola Tesla' },
  { text: 'The physics is the same. It is just done with electrons instead of photons.', author: 'Carver Mead' },
  { text: 'A semiconductor is a device whose electrical properties are halfway between a conductor and an insulator.', author: 'William Shockley' },
  { text: 'The transistor was probably the most important invention of the 20th century.', author: 'John Bardeen' },
  { text: 'It\'s not the tools that you have faith in — tools are just tools. They work, or they don\'t work.', author: 'Lynn Conway' },
  { text: 'Realize that everything connects to everything else.', author: 'Leonardo da Vinci' },
  { text: 'Technology is best when it brings people together.', author: 'Matt Mullenweg' },
  { text: 'The science of today is the technology of tomorrow.', author: 'Edward Teller' },
  { text: 'Any sufficiently advanced technology is indistinguishable from magic.', author: 'Arthur C. Clarke' },
  { text: 'The chip is the most important invention since the wheel.', author: 'T.R. Reid' },
  { text: 'Making chips is the most complex manufacturing process humans have ever devised.', author: 'Pat Gelsinger' },
  { text: 'RISC-V is the Linux of the hardware world.', author: 'David Patterson' },
  { text: 'We are at the dawn of a new era in computing — one defined by specialized chips.', author: 'Jensen Huang' },
  { text: 'Moore\'s Law is not dead. It\'s just changing form.', author: 'Lisa Su' },
  { text: 'Small is beautiful.', author: 'E.F. Schumacher' },
]

const route = useRoute()
const quote = ref(null)

const quoteChars = computed(() => {
  if (!quote.value) return []
  return ('"' + quote.value.text + '"').replace(/ /g, '\u00A0').split('')
})

function pickQuote() {
  const nextQuote = quotes[Math.floor(Math.random() * quotes.length)]

  if (typeof window === 'undefined') {
    quote.value = nextQuote
    return
  }

  quote.value = null
  window.requestAnimationFrame(() => {
    quote.value = nextQuote
  })
}

pickQuote()
watch(() => route.path, pickQuote)
</script>

<style scoped>
.ai-quote-bar {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  margin-bottom: 0.7rem;
  background: linear-gradient(90deg, rgba(0,229,255,0.04), rgba(124,77,255,0.06), rgba(0,229,255,0.04));
  border-bottom: 1px solid rgba(0,229,255,0.08);
  font-size: 0.78rem;
  line-height: 1.5;
  flex-wrap: wrap;
}

.ai-quote-text {
  color: var(--vp-c-text-2);
  font-style: italic;
  letter-spacing: 0.01em;
}

.ai-quote-char {
  display: inline-block;
  opacity: 0;
  animation: char-appear 0.3s ease-out forwards;
  white-space: pre;
}

@keyframes char-appear {
  0% { opacity: 0; transform: translateY(6px); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.ai-quote-author {
  color: var(--ai-cyan, #00e5ff);
  font-weight: 600;
  font-size: 0.72rem;
  opacity: 0;
  white-space: nowrap;
  animation: author-in 0.5s ease-out forwards;
  /* delay is set dynamically via :style */
}

@keyframes author-in {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 0.7; transform: translateX(0); }
}
</style>
