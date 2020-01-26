export type Byte = number & { __type__: 'Byte' }
export const Byte = {
  fromNumber (value: number) {
    if ((value & 0xFF) !== value) {
      throw new TypeError(`Cannot cast ${value} to byte`)
    }
    return value as Byte
  },
  fromHex (value: string) {
    if (!/^[\da-f]{2}$/i.test(value)) {
      throw new TypeError(`Cannot cast "${value}" to byte`)
    }
    return parseInt(value, 16) as Byte
  },
}
