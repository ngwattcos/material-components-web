/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {MDCFoundation} from '@material/base/foundation';
import {SpecificEventListener} from '@material/base/types';
import {MDCLineRippleAdapter} from './adapter';
import {cssClasses} from './constants';

export class MDCLineRippleFoundation extends MDCFoundation<MDCLineRippleAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  private readonly transitionEndHandler_: SpecificEventListener<'transitionend'>;

  constructor(protected readonly adapter: MDCLineRippleAdapter) {
    super(adapter);

    this.transitionEndHandler_ = (evt) => this.handleTransitionEnd(evt);
  }

  init() {
    this.adapter.registerEventHandler(
        'transitionend', this.transitionEndHandler_);
  }

  destroy() {
    this.adapter.deregisterEventHandler(
        'transitionend', this.transitionEndHandler_);
  }

  activate() {
    this.adapter.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING);
    this.adapter.addClass(cssClasses.LINE_RIPPLE_ACTIVE);
  }

  setRippleCenter(xCoordinate: number) {
    this.adapter.setStyle('transform-origin', `${xCoordinate}px center`);
  }

  deactivate() {
    this.adapter.addClass(cssClasses.LINE_RIPPLE_DEACTIVATING);
  }

  handleTransitionEnd(evt: TransitionEvent) {
    // Wait for the line ripple to be either transparent or opaque
    // before emitting the animation end event
    const isDeactivating =
        this.adapter.hasClass(cssClasses.LINE_RIPPLE_DEACTIVATING);

    if (evt.propertyName === 'opacity') {
      if (isDeactivating) {
        this.adapter.removeClass(cssClasses.LINE_RIPPLE_ACTIVE);
        this.adapter.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING);
      }
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCLineRippleFoundation;
