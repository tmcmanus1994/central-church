"use client";

import { useEffect, useState } from "react";
import {
  Fit,
  Alignment,
  Layout,
  RuntimeLoader,
  StateMachineInputType,
  useRive,
  type StateMachineInput,
} from "@rive-app/react-canvas";

// The runtime otherwise pulls its WebAssembly engine from a CDN on every page
// load. Serving the copy that ships with the package (public/rive/rive.wasm,
// copied from node_modules/@rive-app/canvas) keeps the page working without
// that outside dependency. Keep the two in step when the package is upgraded.
RuntimeLoader.setWasmUrl("/rive/rive.wasm");

/**
 * A bare-bones Rive viewer for trying out `.riv` exports on the real site.
 *
 * It reads whatever the file contains (artboards, timeline animations, state
 * machines, and each state machine's inputs) and puts a control on screen for
 * every one of them, so a file can be poked at without writing any code for
 * it first. Nothing here is specific to one file — swap `src` and it still
 * works.
 */
export function RivePlayground({ src }: { src: string }) {
  const { rive, RiveComponent } = useRive({
    src,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const [active, setActive] = useState<string | null>(null);
  const [inputs, setInputs] = useState<StateMachineInput[]>([]);
  // Bumped after a trigger fires or a value changes, so the input list re-reads.
  const [tick, setTick] = useState(0);

  const contents = rive?.contents;
  const artboard = contents?.artboards?.[0];
  const animations = artboard?.animations ?? [];
  const stateMachines = artboard?.stateMachines ?? [];

  // Pick a state machine by default when the file has one: that's what a
  // real embed would run, and it's where the interactive inputs live.
  useEffect(() => {
    if (!rive || active !== null) return;
    const first = stateMachines[0]?.name ?? animations[0];
    if (first) play(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive, artboard]);

  function play(name: string) {
    if (!rive) return;
    rive.stop();
    rive.play(name);
    setActive(name);
    const isStateMachine = stateMachines.some((sm) => sm.name === name);
    setInputs(isStateMachine ? (rive.stateMachineInputs(name) ?? []) : []);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
      <div className="overflow-hidden rounded-2xl border border-line bg-[repeating-conic-gradient(#f3f3f1_0%_25%,#ffffff_0%_50%)] bg-[length:24px_24px]">
        <div className="aspect-square w-full lg:aspect-[4/3]">
          <RiveComponent className="h-full w-full" />
        </div>
      </div>

      <div className="flex flex-col gap-6 text-[15px] leading-[1.6] text-body">
        {!rive && <p className="m-0">Loading {src}…</p>}

        {rive && (
          <>
            <Section title="File">
              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-ink/60">Artboard</dt>
                <dd className="m-0 font-medium text-ink">{artboard?.name ?? "—"}</dd>
                <dt className="text-ink/60">Playing</dt>
                <dd className="m-0 font-medium text-ink">{active ?? "—"}</dd>
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => rive.play()}>Play</Button>
                <Button onClick={() => rive.pause()}>Pause</Button>
                <Button onClick={() => active && play(active)}>Restart</Button>
              </div>
            </Section>

            {stateMachines.length > 0 && (
              <Section title="State machines">
                <div className="flex flex-wrap gap-2">
                  {stateMachines.map((sm) => (
                    <Button key={sm.name} active={active === sm.name} onClick={() => play(sm.name)}>
                      {sm.name}
                    </Button>
                  ))}
                </div>
              </Section>
            )}

            {animations.length > 0 && (
              <Section title="Timeline animations">
                <div className="flex flex-wrap gap-2">
                  {animations.map((name) => (
                    <Button key={name} active={active === name} onClick={() => play(name)}>
                      {name}
                    </Button>
                  ))}
                </div>
              </Section>
            )}

            {inputs.length > 0 && (
              <Section title={`Inputs — ${active}`}>
                <ul className="m-0 flex list-none flex-col gap-3 p-0" key={tick}>
                  {inputs.map((input) => (
                    <li key={input.name} className="flex items-center justify-between gap-4">
                      <span className="font-medium text-ink">{input.name}</span>
                      <InputControl input={input} onChange={() => setTick((t) => t + 1)} />
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {active && stateMachines.some((sm) => sm.name === active) && inputs.length === 0 && (
              <p className="m-0 text-ink/60">This state machine has no inputs.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InputControl({ input, onChange }: { input: StateMachineInput; onChange: () => void }) {
  if (input.type === StateMachineInputType.Trigger) {
    return (
      <Button
        onClick={() => {
          input.fire();
          onChange();
        }}
      >
        Fire
      </Button>
    );
  }
  if (input.type === StateMachineInputType.Boolean) {
    const on = Boolean(input.value);
    return (
      <Button
        active={on}
        onClick={() => {
          input.value = !on;
          onChange();
        }}
      >
        {on ? "true" : "false"}
      </Button>
    );
  }
  return (
    <input
      type="number"
      step="any"
      defaultValue={Number(input.value)}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (!Number.isNaN(n)) {
          input.value = n;
          onChange();
        }
      }}
      className="w-28 rounded-lg border border-line bg-white px-3 py-1.5 text-right text-ink"
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="m-0 mb-2 text-xs font-bold tracking-[.14em] uppercase text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Button({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
        (active
          ? "border-primary bg-primary text-white"
          : "border-line bg-white text-ink hover:border-primary hover:text-primary")
      }
    >
      {children}
    </button>
  );
}
