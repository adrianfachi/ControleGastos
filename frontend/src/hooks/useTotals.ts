import { useCallback, useEffect, useState } from 'react'

import { extractErrorMessage, getTotals } from '../services/api'
import type { TotalsResponse } from '../types/totals'

/**
 * Carrega o resumo financeiro exibido na consulta de totais.
 * O hook mantém a tela desacoplada do detalhe da API e concentra o estado de erro.
 */
export function useTotals() {
  const [totals, setTotals] = useState<TotalsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshTotals = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getTotals()
      setTotals(data)
    } catch (requestError) {
      setError(extractErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshTotals()
  }, [refreshTotals])

  return {
    totals,
    loading,
    error,
    refreshTotals,
  }
}