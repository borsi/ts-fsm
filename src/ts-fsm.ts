export class Transition<State, T> {
  constructor(
    public state: State,
    public trigger: T,
    public effect?: Function,
    public guard?: Function
  ) {}
}

export class State<Constant, Trigger> {
  private _transitions: Map<Trigger, Transition<State<Constant, Trigger>, Trigger>>

  constructor(public value: Constant) {
    this._transitions = new Map<Trigger, Transition<State<Constant, Trigger>, Trigger>>()
  }

  public addTransition(
    to: State<Constant, Trigger>,
    trigger: Trigger,
    effect?: Function,
    guard?: Function
  ): void {
    let transition = new Transition(to, trigger, effect, guard)
    this._transitions.set(trigger, transition)
  }

  public activate(trigger: Trigger): State<Constant, Trigger> {
    let tr = this._transitions.get(trigger)
    if (!tr) {
      throw RangeError('There is no transition from this state for this trigger.')
    }
    if (tr.guard) {
      if (tr.guard()) {
        if (tr.effect) {
          tr.effect()
        }
        return tr.state
      } else {
        return this
      }
    }
    if (tr.effect) {
      tr.effect()
    }
    return tr.state
  }
}

export default class StateMachine<Constant, Trigger> {
  private _current: State<Constant, Trigger>
  public get current() {
    return this._current.value
  }
  public set current(value: Constant) {
    let state = this._states.get(value)
    if (!state) {
      state = new State<Constant, Trigger>(value)
      this._states.set(value, state)
    }
    this._current = state
  }

  private _states: Map<Constant, State<Constant, Trigger>>

  constructor(startState: Constant) {
    this._states = new Map<Constant, State<Constant, Trigger>>()
    let state = new State<Constant, Trigger>(startState)
    this._states.set(startState, state)
    this._current = state
  }

  public addTransition(
    from: Constant,
    to: Constant,
    trigger: Trigger,
    effect?: Function,
    guard?: Function
  ) {
    let fromState = this._states.get(from) || new State<Constant, Trigger>(from)
    let toState = this._states.get(to) || new State<Constant, Trigger>(to)

    fromState.addTransition(toState, trigger, effect, guard)
  }

  public onTrigger(trigger: Trigger) {
    this._current = this._current.activate(trigger)
  }
}
