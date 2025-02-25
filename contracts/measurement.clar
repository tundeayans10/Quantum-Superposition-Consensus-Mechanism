;; Measurement Contract

(define-map measurements
  { id: uint }
  {
    quantum-state-id: uint,
    result: (string-ascii 64),
    timestamp: uint
  }
)

(define-data-var next-id uint u0)

(define-public (perform-measurement (quantum-state-id uint))
  (match (map-get? quantum-states { id: quantum-state-id })
    state
      (let
        ((id (var-get next-id))
         (result (if (get superposition state) "collapsed" "measured")))
        (var-set next-id (+ id u1))
        (map-set quantum-states
          { id: quantum-state-id }
          (merge state { superposition: false })
        )
        (ok (map-set measurements
          { id: id }
          {
            quantum-state-id: quantum-state-id,
            result: result,
            timestamp: block-height
          }
        )))
    (err u404)
  )
)

(define-read-only (get-measurement (id uint))
  (map-get? measurements { id: id })
)

