"use client";

import { useEffect, useMemo, useState } from "react";
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

export interface RiveFile {
  /** Path under /public, e.g. "/rive/Final.riv". */
  src: string;
  label: string;
  /** Artboard to open first; the file's own default when omitted. */
  artboard?: string;
}

/**
 * A bare-bones Rive viewer for trying out `.riv` exports on the real site.
 *
 * It reads whatever the file contains (artboards, timeline animations, state
 * machines, and each state machine's inputs) and puts a control on screen for
 * every one of them, so a file can be poked at without writing any code for
 * it first. Hover and click listeners inside a state machine work on the
 * canvas directly, as they would in a real embed.
 */
export function RivePlayground({ files }: { files: RiveFile[] }) {
  const [file, setFile] = useState(files[0]);
  // `undefined` = the file's default artboard. Changing it re-mounts the viewer,
  // since the runtime picks the artboard once, at load.
  const [artboard, setArtboard] = useState<string | undefined>(files[0]?.artboard);
  const [artboards, setArtboards] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      {files.length > 1 && (
        <Section title="File">
          <div className="flex flex-wrap gap-2">
            {files.map((f) => (
              <Button
                key={f.src}
                active={f.src === file.src}
                onClick={() => {
                  setFile(f);
                  setArtboard(f.artboard);
                  setArtboards([]);
                }}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </Section>
      )}

      {artboards.length > 1 && (
        <Section title="Artboards">
          <div className="flex flex-wrap gap-2">
            {artboards.map((name, i) => (
              <Button
                key={name}
                active={artboard === name || (artboard === undefined && i === 0)}
                onClick={() => setArtboard(name)}
              >
                {name}
              </Button>
            ))}
          </div>
        </Section>
      )}

      <Viewer
        key={`${file.src}::${artboard ?? ""}`}
        src={file.src}
        artboard={artboard}
        onArtboards={setArtboards}
      />
    </div>
  );
}

function Viewer({
  src,
  artboard,
  onArtboards,
}: {
  src: string;
  artboard?: string;
  onArtboards: (names: string[]) => void;
}) {
  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const [active, setActive] = useState<string | null>(null);
  const [inputs, setInputs] = useState<StateMachineInput[]>([]);
  // Bumped after a trigger fires or a value changes, so the input list re-reads.
  const [tick, setTick] = useState(0);

  // `rive.contents` is rebuilt on every access, so read it once per loaded
  // instance. Reading it per render would hand the effect below a fresh
  // object each time and re-run it on every re-render — including the ones
  // the runtime's own resize handling causes.
  const contents = useMemo(() => rive?.contents, [rive]);
  const allArtboards = useMemo(() => contents?.artboards ?? [], [contents]);
  const current = useMemo(
    () => (artboard ? allArtboards.find((a) => a.name === artboard) : undefined) ?? allArtboards[0],
    [allArtboards, artboard],
  );
  const animations = current?.animations ?? [];
  const stateMachines = current?.stateMachines ?? [];

  // Runs once per loaded file: reports the artboard list up and starts the
  // artboard's first state machine, which is what a real embed would run and
  // where hover/click listeners and inputs live.
  useEffect(() => {
    if (!rive) return;
    onArtboards(allArtboards.map((a) => a.name));
    const first = stateMachines[0]?.name ?? animations[0];
    if (first) play(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive]);

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
            <Section title="Now playing">
              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-ink/60">Artboard</dt>
                <dd className="m-0 font-medium text-ink">{current?.name ?? "—"}</dd>
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
                <p className="m-0 mt-2 text-sm text-ink/60">
                  Hover and click listeners run while a state machine is playing — try the canvas.
                </p>
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
              <p className="m-0 text-ink/60">
                This state machine has no inputs — it&rsquo;s driven by listeners (hover, click) on the
                canvas instead.
              </p>
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
