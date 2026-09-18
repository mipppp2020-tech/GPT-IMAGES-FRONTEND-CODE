import { Icon } from './Icon';

export interface WorkflowStepSpec {
  label: string;
  /** Optional second line, e.g. the date a stage completed. */
  note?: string;
}

/**
 * WorkflowProgress — the staged tracker used by every multi-step rider flow.
 *
 * `tone="accent"` renders the current step in the primary colour (capture
 * flow); the default renders it in info blue (post-submission tracking),
 * matching the two treatments in the references.
 */
export function WorkflowProgress({
  steps,
  current,
  tone = 'info',
}: {
  steps: WorkflowStepSpec[];
  /** Zero-based index of the step in progress. */
  current: number;
  tone?: 'info' | 'accent';
}) {
  return (
    <ol className="aiec-workflow">
      {steps.map((s, i) => (
        <WorkflowStep
          key={s.label}
          index={i}
          label={s.label}
          note={s.note}
          state={i < current ? 'done' : i === current ? 'current' : 'todo'}
          tone={tone}
        />
      ))}
    </ol>
  );
}

export function WorkflowStep({
  index,
  label,
  note,
  state,
  tone = 'info',
}: {
  index: number;
  label: string;
  note?: string;
  state: 'done' | 'current' | 'todo';
  tone?: 'info' | 'accent';
}) {
  const cls = [
    'aiec-wstep',
    state === 'done' ? 'aiec-wstep--done' : '',
    state === 'current' ? 'aiec-wstep--current' : '',
    state === 'current' && tone === 'accent' ? 'aiec-wstep--accent' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={cls} aria-current={state === 'current' ? 'step' : undefined}>
      <span className="aiec-wstep__marker">
        {state === 'done' ? <Icon name="check" size={15} stroke={2.6} /> : index + 1}
      </span>
      <span className="aiec-wstep__label aiec-no-clip">{label}</span>
      {note ? <span className="aiec-wstep__note aiec-no-clip">{note}</span> : null}
    </li>
  );
}
