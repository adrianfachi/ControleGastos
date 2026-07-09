import type { FormEvent } from 'react'

type UserCreateFormProps = {
  name: string
  age: string
  onNameChange: (value: string) => void
  onAgeChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitting: boolean
  error: string | null
}

export function UserCreateForm({ name, age, onNameChange, onAgeChange, onSubmit, submitting, error }: UserCreateFormProps) {
  return (
    <article className="rounded-3xl border border-slate-200/10 bg-slate-900 p-6 shadow-xl shadow-black/10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">Cadastro de pessoas</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Nova pessoa</h3>
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Nome</span>
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/70"
            placeholder="Ex.: Maria Silva"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Idade</span>
          <input
            type="number"
            min="0"
            max="120"
            value={age}
            onChange={(event) => onAgeChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/70"
            placeholder="Ex.: 32"
          />
        </label>

        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Salvando...' : 'Cadastrar pessoa'}
        </button>
      </form>
    </article>
  )
}