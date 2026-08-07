import { Button } from 'winduum-elements/components/button/index.js'

customElements.define('x-button', class Element extends Button(HTMLButtonElement) {}, { extends: 'button' })
customElements.define('x-button-a', class Element extends Button(HTMLAnchorElement) {}, { extends: 'a' })
