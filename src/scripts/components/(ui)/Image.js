import { Image } from 'winduum-elements/components/image/index.js'

customElements.define('x-image', class Element extends Image(HTMLPictureElement) {}, { extends: 'picture' })
