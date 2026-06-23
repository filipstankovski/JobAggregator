import { S } from '../lib/styles'

export function Hero({ dark }) {
  return (
    <section style={S.hero}>
      <img
        src={dark ? '/logo-dark.png' : '/logo-light.png'}
        alt="RabotekaMK"
        style={{ height: 90, width: 'auto', objectFit: 'contain', marginBottom: '1rem' }}
      />
      <h1 style={S.heroTitle}>Најди ја<br/>твојата следна работа.</h1>
      <p style={S.heroSub}>
        РаботекаМК агрегира огласи од kariera.mk, vrabotuvanje.com.mk и najdirabota.com.mk — на едно место.
      </p>
    </section>
  )
}
