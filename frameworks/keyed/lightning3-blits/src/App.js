/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import Blits from '@lightningjs/blits'

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let nextId = 1;

const buildData = (count) => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }

  return data;
};

const buttonMap = {
  'run' : 'Create 1,000 rows',
  'runlots' : 'Create 10,000 rows',
  'add' : 'Append 1,000 rows',
  'update' : 'Update every 10th row',
  'clear' : 'Clear',
  'swaprows' : 'Swap Rows'
}

const button = (type) => {
  const div = document.createElement('div');
  div.classList = 'col-sm-6 smallpad';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.classList = 'btn btn-primary btn-block';
  btn.id = type;
  btn.innerHTML = buttonMap[type];
  div.appendChild(btn);

  return div;
}

const renderButtons = () => {
  const buttonCt = document.getElementById('buttons');

  const runButton = button('run');
  buttonCt.appendChild(runButton);

  const runLotsButton = button('runlots');
  buttonCt.appendChild(runLotsButton);

  const addButton = button('add');
  buttonCt.appendChild(addButton);

  const updateButton = button('update');
  buttonCt.appendChild(updateButton);

  const clearButton = button('clear');
  buttonCt.appendChild(clearButton);

  const swapRowsButton = button('swaprows');
  buttonCt.appendChild(swapRowsButton);
}

const Row = Blits.Component('Row', {
  template: `
    <Element w="800" h="50" x="0" y="$index * 50" color="grey" data="{'type': 'row'}" >
      <Text content="$id" w="50" h="45" color="purple" data="{'type': 'id'}" />
      <Text content="$label" w="700" x="100" h="45" color="yellow" data="{'type': 'content'}" />
      <Element w="50" h="45" x="750" data="{'type': 'remove'}" />
      <Element w="50" h="45" x="800" data="{'type': 'empty'}" />
    </Element>`,
  props: ['id', 'label', 'index'],
  hooks: {
    init() {
      console.log(`Row ${this.id} created`, this.label);
    }
  }
})

export default Blits.Application({
  components: {
    Row
  },
  template: `
    <Element w="1920" h="1080" x="0" y="0" color="white" data="{'type': 'benchmark'}">
      <Row :for="(d, index) in $data" :key="$d.id" :id="$d.id" :label="$d.label" :index="$index" />
    </Element>`,
  state() {
    return {
      data: []
    }
  },
  hooks: {
    ready() {
      renderButtons();

      document.getElementById('run').addEventListener('click', () => {
        this.data = buildData(1000);
      });

      document.getElementById('runlots').addEventListener('click', () => {
        this.data = buildData(10000);
      });

      document.getElementById('add').addEventListener('click', () => {
        this.data = this.data.concat(buildData(1000));
      });

      document.getElementById('update').addEventListener('click', () => {
        const newData = this.data.slice(0);

        for (let i = 0; i < newData.length; i += 10) {
          const r = newData[i];

          newData[i] = { id: r.id, label: r.label + " !!!" };
        }

        this.data = newData;
      });

      document.getElementById('clear').addEventListener('click', () => {
        console.log('clearing');

        // hack - if I just clear the array it wont trigger a re-render
        this.data = [{}];
      });

      document.getElementById('swaprows').addEventListener('click', () => {
        if (this.data.length > 998) {
          const newdata = [...this.data];
          const d1 = newdata[1];
          const d998 = newdata[998];
          newdata[1] = d998;
          newdata[998] = d1;
          this.data = newdata;
        }
      });
    },

  },
});
