import type { FlowStep } from "@/lib/types";
export default function ArchitectureDiagram({ steps }: { steps: FlowStep[] }) {
  return <ol className="architecture-flow" aria-label="项目流程">{steps.map((step,index) => <li key={step.label}><span className="mono">0{index+1}</span><span>{step.label}</span>{index<steps.length-1 && <i aria-hidden="true">→</i>}</li>)}</ol>;
}
