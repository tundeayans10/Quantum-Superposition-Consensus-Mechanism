import { describe, it, beforeEach, expect } from "vitest"

describe("Measurement Contract", () => {
  let mockStorage: Map<string, any>
  let nextId: number
  let mockQuantumStates: Map<string, any>
  
  beforeEach(() => {
    mockStorage = new Map()
    mockQuantumStates = new Map()
    nextId = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "perform-measurement":
        const [quantumStateId] = args
        const quantumState = mockQuantumStates.get(quantumStateId)
        if (!quantumState) return { success: false, error: 404 }
        const id = nextId++
        const result = quantumState.superposition ? "collapsed" : "measured"
        mockStorage.set(id, { quantum_state_id: quantumStateId, result, timestamp: Date.now() })
        quantumState.superposition = false
        return { success: true, value: id }
      case "get-measurement":
        return { success: true, value: mockStorage.get(args[0]) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should perform a measurement", () => {
    mockQuantumStates.set(0, { state: "superposition", superposition: true })
    const result = mockContractCall("perform-measurement", [0])
    expect(result.success).toBe(true)
    expect(result.value).toBe(0)
  })
  
  it("should get a measurement", () => {
    mockQuantumStates.set(0, { state: "superposition", superposition: true })
    mockContractCall("perform-measurement", [0])
    const result = mockContractCall("get-measurement", [0])
    expect(result.success).toBe(true)
    expect(result.value.quantum_state_id).toBe(0)
    expect(result.value.result).toBe("collapsed")
  })
})

