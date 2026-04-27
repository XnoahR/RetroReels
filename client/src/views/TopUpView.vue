<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 px-4 pb-32 pt-10 text-white sm:px-6 lg:px-8">
      <div class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_24rem]">
        <div class="rounded-lg border border-white/10 bg-white/[0.025] p-5 shadow-2xl shadow-black/30">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-300">Dummy Midtrans</p>
          <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 class="text-3xl font-black tracking-tight">Top Up Credits</h1>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Add sandbox credits to buy tapes and unlock tracks in your player library.
              </p>
            </div>
            <div class="rounded border border-serenade-500/30 bg-serenade-500/10 px-4 py-3 text-right">
              <p class="text-[0.65rem] font-black uppercase tracking-widest text-serenade-200">Current Balance</p>
              <p class="mt-1 font-mono text-2xl font-black text-serenade-300">${{ currentCredits }}</p>
            </div>
          </div>

          <div class="mt-8">
            <p class="mb-3 text-xs font-black uppercase tracking-[0.22em] text-gray-500">Amount</p>
            <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
              <button
                v-for="amount in presetAmounts"
                :key="amount"
                type="button"
                class="h-20 rounded-lg border text-left transition"
                :class="selectedAmount === amount && !isCustomAmount
                  ? 'border-serenade-500/60 bg-serenade-500/15 text-serenade-200 shadow-[0_0_24px_rgba(245,143,66,0.12)]'
                  : 'border-white/10 bg-black/25 text-gray-300 hover:border-white/20 hover:bg-white/[0.04]'"
                @click="selectPreset(amount)"
              >
                <span class="block px-4 font-mono text-2xl font-black">${{ amount }}</span>
                <span class="block px-4 text-[0.65rem] font-black uppercase tracking-widest text-gray-500">Instant credit</span>
              </button>
            </div>

            <label class="mt-4 block">
              <span class="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-gray-500">Custom Amount</span>
              <input
                v-model.number="customAmount"
                type="number"
                min="10"
                max="5000"
                class="h-12 w-full rounded border border-white/10 bg-black/35 px-4 font-mono text-sm font-bold text-white outline-none placeholder:text-gray-600 focus:border-serenade-500/60"
                placeholder="10 - 5000"
                @focus="isCustomAmount = true"
              />
            </label>
          </div>

          <div class="mt-8">
            <p class="mb-3 text-xs font-black uppercase tracking-[0.22em] text-gray-500">Payment Method</p>
            <div class="grid gap-3 md:grid-cols-3">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                type="button"
                class="rounded-lg border p-4 text-left transition"
                :class="selectedMethod === method.id
                  ? 'border-serenade-500/60 bg-serenade-500/15'
                  : 'border-white/10 bg-black/25 hover:border-white/20 hover:bg-white/[0.04]'"
                @click="selectedMethod = method.id"
              >
                <component :is="method.icon" class="mb-4 h-6 w-6 text-serenade-300" />
                <p class="font-black">{{ method.name }}</p>
                <p class="mt-1 text-xs font-bold text-gray-500">{{ method.caption }}</p>
              </button>
            </div>
          </div>

          <p v-if="message.text" class="mt-6 rounded border px-4 py-3 text-sm font-bold" :class="message.type === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-200' : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'">
            {{ message.text }}
          </p>
        </div>

        <aside class="h-fit rounded-lg border border-white/10 bg-black/35 p-5 shadow-2xl shadow-black/30 lg:sticky lg:top-24">
          <div class="flex items-center gap-3 border-b border-white/10 pb-4">
            <div class="grid h-11 w-11 place-items-center rounded bg-serenade-500 text-black">
              <ReceiptText class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs font-black uppercase tracking-widest text-gray-500">Payment Summary</p>
              <h2 class="font-black">Retro Reels Wallet</h2>
            </div>
          </div>

          <div class="space-y-3 py-5 text-sm">
            <div class="flex items-center justify-between text-gray-400">
              <span>Credits</span>
              <strong class="font-mono text-white">${{ finalAmount }}</strong>
            </div>
            <div class="flex items-center justify-between text-gray-400">
              <span>Gateway fee</span>
              <strong class="font-mono text-white">$0</strong>
            </div>
            <div class="flex items-center justify-between border-t border-white/10 pt-4">
              <span class="font-black">Total</span>
              <strong class="font-mono text-2xl text-serenade-300">${{ finalAmount }}</strong>
            </div>
          </div>

          <button
            type="button"
            class="h-12 w-full rounded bg-serenade-500 text-sm font-black uppercase tracking-widest text-black transition hover:bg-serenade-400 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isProcessing || !isValidAmount"
            @click="submitTopUp"
          >
            {{ isProcessing ? 'Processing...' : 'Pay With Dummy Midtrans' }}
          </button>

          <button
            type="button"
            class="mt-3 h-11 w-full rounded border border-white/10 text-sm font-black uppercase tracking-widest text-gray-300 transition hover:bg-white/[0.06]"
            @click="router.back()"
          >
            Cancel
          </button>
        </aside>
      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Building2, CreditCard, QrCode, ReceiptText } from 'lucide-vue-next';
import customFetch from '@/api';
import HomeLayout from '@/layouts/HomeLayout.vue';

const router = useRouter();
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentCredits = ref(storedUser.credits ?? 0);
const presetAmounts = [50, 100, 250, 500];
const selectedAmount = ref(100);
const customAmount = ref(null);
const isCustomAmount = ref(false);
const selectedMethod = ref('qris');
const isProcessing = ref(false);
const message = reactive({ text: '', type: 'success' });

const paymentMethods = [
  { id: 'qris', name: 'QRIS', caption: 'Scan and settle instantly', icon: QrCode },
  { id: 'card', name: 'Card', caption: 'Visa, Mastercard sandbox', icon: CreditCard },
  { id: 'bank', name: 'Virtual Account', caption: 'BCA, BRI, Mandiri dummy', icon: Building2 },
];

const finalAmount = computed(() => {
  const value = isCustomAmount.value ? Number(customAmount.value) : selectedAmount.value;
  return Number.isFinite(value) ? Math.floor(value) : 0;
});

const isValidAmount = computed(() => finalAmount.value >= 10 && finalAmount.value <= 5000);

const selectPreset = (amount) => {
  isCustomAmount.value = false;
  selectedAmount.value = amount;
};

const setMessage = (text, type = 'success') => {
  message.text = text;
  message.type = type;
};

const submitTopUp = async () => {
  if (!isValidAmount.value) {
    setMessage('Choose an amount between $10 and $5000.', 'error');
    return;
  }

  isProcessing.value = true;
  setMessage('');

  try {
    const { data } = await customFetch.post('auth/top-up', {
      amount: finalAmount.value,
      method: selectedMethod.value,
    });

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      currentCredits.value = data.user.credits ?? currentCredits.value;
      window.dispatchEvent(new CustomEvent('retro-reels:user-updated', { detail: { user: data.user } }));
    }

    setMessage(`${data.transaction?.id || 'Payment'} settled. Credits updated.`);
  } catch (error) {
    setMessage(error.response?.data?.message || 'Could not process dummy payment.', 'error');
  } finally {
    isProcessing.value = false;
  }
};
</script>
