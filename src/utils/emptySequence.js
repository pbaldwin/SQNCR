export default function createEmptySequence() {
  const note = {
    active: false,
    id: null,
  }

  return Array(16)
              .fill()
              .map((_, idx) => {
                return {
                  active: false,
                  id: `row-${idx}`,
                  columns: Array(8)
                            .fill()
                            .map((_, jdx) => {
                              return Object.assign({}, note, { id: `${idx}-${jdx}`})
                            })
                }
              })
}
