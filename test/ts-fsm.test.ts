import StateMachine, { State } from '../src/ts-fsm'

enum Character {
  IDLE,
  WALK_RIGHT,
  WALK_LEFT,
  JUMP,
  CLIMBING
}

enum Input {
  LEFT_PRESSED,
  LEFT_RELEASED,
  RIGHT_PRESSED,
  RIGHT_RELEASED,
  FLOOR_COLLISION,
  RELEASED_PRESSED,
  RELEASED_UP,
  SPACE_PRESSED
}

describe('Basic test', () => {
  it('is instantiable', () => {
    expect(new StateMachine<Character, Input>(Character.IDLE)).toBeInstanceOf(StateMachine)
  })

  it('follows a basic transition', () => {
    let fsm = new StateMachine<Character, Input>(Character.IDLE)

    fsm.addTransition(Character.IDLE, Character.WALK_RIGHT, Input.RIGHT_PRESSED)
    expect(fsm.current === Character.IDLE)

    fsm.onTrigger(Input.RIGHT_PRESSED)
    expect(fsm.current === Character.WALK_RIGHT)
  })
})
