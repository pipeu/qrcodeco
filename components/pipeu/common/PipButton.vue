<template>
  <div>
    <template v-if="type === 'big-fixed'">
      <div class="button-container">
        <div class="fixed-button" style="z-index: 100;">
          <button type="button" :disabled="disabled" @click.prevent="$emit('click', $event.target.value)" class="btn btn-large" :style="customCSS">
            <slot></slot>
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'large'">
      <button type="button" :disabled="disabled" @click.prevent="$emit('click', $event.target.value)" class="btn pip-button btn-large" :style="customCSS">
        <slot></slot>
      </button>
    </template>

    <template v-else-if="type === 'outline'">
      <button type="button" :disabled="disabled" @click.prevent="$emit('click', $event.target.value)" class="btn btn-pip-outline" :style="customCSS">
        <slot></slot>
      </button>
    </template>

    <template v-else-if="type === 'popup'">
      <div class="class-teste">
        <a :href="linkURL" target="_blank" class="btn pip-button" :style="customCSS">
          <slot></slot>
        </a>
      </div>
    </template>

    <template v-else-if="type === 'regular'">
      <button type="button" :disabled="disabled" @click.prevent="$emit('click', $event.target.value)" class="btn pip-button-regular" :style="customCSS">
        <slot></slot>
      </button>
    </template>

    <template v-else>
      <button type="button" :disabled="disabled" @click.prevent="$emit('click', $event.target.value)" class="btn pip-button" :style="customCSS">
        <slot></slot>
      </button>
    </template>

  </div>
</template>

<script>
  /* eslint-disable */
  import { eventHub } from '@/utils/eventHub'
  export default {
    name: 'PipButton',

    data: function() {
      return {
        some: ''
      }
    },

    props: {
      type: {
        required: false,
        type: String,
        default () {
          return 'default' //big-fixed, big
        }
      },
      disabled: {
        required: false,
        type: Boolean,
        default () {
          return false
        }
      },
      linkURL: {
        required: false,
        type: String,
        default () {
          return ''
        }
      },
      customCSS: {
          required: false,
          type: String,
          default () {
              return ''
          }
      }
    }
  }
</script>

<style>
  .btn-pip-outline {
    text-decoration: none;
    color: #ff2f38;
    background-color: #fff;
    text-align: center;
    letter-spacing: 0.2px;
    -webkit-transition: background-color .2s ease-out;
    transition: background-color .2s ease-out;
    cursor: pointer;
    border-radius: 5px;
    /*width: 40%;*/
    border: 1px solid #ff2f38;
    box-shadow: none;
  }
</style>
