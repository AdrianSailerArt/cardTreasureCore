<script setup lang="ts">
/**
 * Anmeldung mit E-Mail und Passwort (nur für Konten mit Passwort, z.B. Testkonten; Shop und CMS blenden es nur ein,
 * wenn der Passwort-Login eingeschaltet ist). Zugeklappt hinter einem Link, damit der Magic-Link der Normalfall bleibt.
 * `signIn` übernimmt die App (eigener Auth-Client) und liefert true bei Erfolg.
 */
const props = defineProps<{ signIn: (email: string, password: string) => Promise<boolean> }>()
const emit = defineEmits<{ done: [] }>()
const locale = useUiLocale()
const de = computed(() => locale.value === 'de')

const open = ref(false)
const email = ref('')
const password = ref('')
const busy = ref(false)
const failed = ref(false)
const errorId = useId()

const submit = async () => {
  busy.value = true
  failed.value = false
  const ok = await props.signIn(email.value.trim(), password.value)
  busy.value = false
  if (ok) emit('done')
  else failed.value = true
}
</script>

<template>
  <div>
    <button v-if="!open" type="button" class="text-meta text-fg-subtle underline-offset-2 hover:text-accent hover:underline" @click="open = true">
      {{ de ? 'Mit Passwort anmelden' : 'Sign in with password' }}
    </button>
    <form v-else class="space-y-3" @submit.prevent="submit">
      <UiField :label="de ? 'E-Mail' : 'Email'"><UiInput v-model="email" type="email" autocomplete="username" /></UiField>
      <UiField :label="de ? 'Passwort' : 'Password'">
        <UiInput v-model="password" type="password" autocomplete="current-password" :aria-invalid="failed ? 'true' : undefined" :aria-describedby="failed ? errorId : undefined" />
      </UiField>
      <UiButton type="submit" variant="ghost" class="w-full" :disabled="busy || !email.includes('@') || !password">
        {{ de ? 'Anmelden' : 'Sign in' }}
      </UiButton>
      <p v-if="failed" :id="errorId" class="text-small text-danger" role="alert" aria-live="assertive">
        {{ de ? 'E-Mail oder Passwort stimmt nicht.' : 'Email or password is incorrect.' }}
      </p>
    </form>
  </div>
</template>
