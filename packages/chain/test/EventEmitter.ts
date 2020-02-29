import {expect} from 'chai'
import sinon from 'sinon'
import { EventEmitter } from '../src/EventEmitter'

describe('EventEmitter', () => {
  it('can emit a single event', () => {
    const listener = sinon.fake()
    const emitter = new EventEmitter<string>()
    emitter.addListener(listener)
    emitter.emit('foo')
    expect(listener).to.be.calledOnceWithExactly('foo')
  })

  it('can emit multiple events', () => {
    const listener = sinon.fake()
    const emitter = new EventEmitter<string>()

    emitter.addListener(listener)
    emitter.emit('foo')
    emitter.emit('bar')

    expect(listener).to.be.calledTwice
    expect(listener.firstCall).to.be.calledWithExactly('foo')
    expect(listener.secondCall).to.be.calledWithExactly('bar')
  })

  it('can support multiple listeners', () => {
    const listenerA = sinon.fake()
    const listenerB = sinon.fake()
    const emitter = new EventEmitter<string>()

    emitter.addListener(listenerA)
    emitter.emit('foo')
    emitter.addListener(listenerB)
    emitter.emit('bar')

    expect(listenerA).to.be.calledTwice
    expect(listenerA.firstCall).to.be.calledWithExactly('foo')
    expect(listenerA.secondCall).to.be.calledWithExactly('bar')
    expect(listenerB).to.be.calledOnceWithExactly('bar')
  })

  it('can remove listeners', () => {
    const listener = sinon.fake()
    const emitter = new EventEmitter<string>()

    const remove = emitter.addListener(listener)
    emitter.emit('foo')
    remove()
    emitter.emit('bar')

    expect(listener).to.be.calledOnceWithExactly('foo')
  })

  it('can add a listener twice and remove once', () => {
    const listener = sinon.fake()
    const emitter = new EventEmitter<string>()

    const remove = emitter.addListener(listener)
    emitter.addListener(listener)
    emitter.emit('foo')
    remove()
    emitter.emit('bar')

    expect(listener).to.be.calledThrice
    expect(listener.firstCall).to.be.calledWithExactly('foo')
    expect(listener.secondCall).to.be.calledWithExactly('foo')
    expect(listener.thirdCall).to.be.calledWithExactly('bar')
  })
})
