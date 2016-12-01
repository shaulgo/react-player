import React from 'react'

import BasePlayer from './BasePlayer'

const AUDIO_EXTENSIONS = /\.(mp3|wav|m4a)($|\?)/i

export default class FilePlayer extends BasePlayer {
  static displayName = 'FilePlayer'
  static canPlay (url) {
    return true
  }
  componentDidMount () {
    const { onPause, onEnded, onError } = this.props
    this.player.addEventListener('canplay', this.onReady)
    this.player.addEventListener('play', this.onPlay)
    this.player.addEventListener('pause', () => {
      if (this.mounted) {
        onPause()
      }
    })
    this.player.addEventListener('ended', onEnded)
    this.player.addEventListener('error', onError)
    this.player.setAttribute('webkit-playsinline', '')
    super.componentDidMount()
  }
  componentWillUnmount () {
    const { onPause, onEnded, onError } = this.props
    this.player.removeEventListener('canplay', this.onReady)
    this.player.removeEventListener('play', this.onPlay)
    this.player.removeEventListener('pause', onPause)
    this.player.removeEventListener('ended', onEnded)
    this.player.removeEventListener('error', onError)
    super.componentWillUnmount()
  }
  load (url) {
    this.player.src = url
  }
  play () {
    this.player.play()
  }
  pause () {
    this.player.pause()
  }
  stop () {
    this.player.removeAttribute('src')
  }
  seekTo (fraction) {
    super.seekTo(fraction)
    this.player.currentTime = this.getDuration() * fraction
  }
  setVolume (fraction) {
    this.player.volume = fraction
  }
  getDuration () {
    if (!this.isReady) return null
    return this.player.duration
  }
  getFractionPlayed () {
    if (!this.isReady) return null
    return this.player.currentTime / this.getDuration()
  }
  getFractionLoaded () {
    if (!this.isReady || this.player.buffered.length === 0) return null
    return this.player.buffered.end(0) / this.getDuration()
  }

  stopBuffering () {
    this.player.pause();
    const currentTime = this.player.currentTime;
    this.player.load();
    this.player.currentTime = currentTime;
  }

  ref = player => {
    this.player = player
  }
  render () {
    const { url, loop, controls, fileConfig } = this.props
    const Media = AUDIO_EXTENSIONS.test(url) ? 'audio' : 'video'
    const style = {
      width: '100%',
      height: '100%',
      display: url ? 'block' : 'none'
    }
    return (
      <Media
        ref={this.ref}
        style={style}
        preload='auto'
        controls={controls}
        loop={loop}
        {...fileConfig.attributes}
      />
    )
  }
}
