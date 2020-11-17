<template>
  <ValidationObserver
    id="upload-form"
    tag="form"
    ref="observer"
    v-slot="{ invalid: invalidForm }"
    @submit.prevent="submit"
  >
    <v-container style="max-width: 590px">
      <v-row dense>

        <v-col cols="4">
          <v-subheader class="px-0">
            Выбрать источник
          </v-subheader>
          <v-select
            v-model="type"
            :items="items"
            item-text="text"
            item-value="value"
            class="align-center"
            dense
            outlined
          >
            <template #prepend-inner>
              <img v-if="type === 'code'" src="@/assets/code.svg" alt="" />
              <img v-if="type === 'file'" src="@/assets/file.svg" alt="" />
              <img v-if="type === 'link'" src="@/assets/link.svg" alt="" />
            </template>
          </v-select>
        </v-col>

        <v-col v-if="type === 'link'" cols="8">

          <v-subheader class="px-0">
            Вставить ссылку
          </v-subheader>

          <ValidationProvider
            name="link"
            rules="required|url"
            v-slot="{ errors, valid, validated }"
          >
            <v-text-field
              v-model="linkSrc"
              :success="valid && validated"
              :error="!valid && validated"
              :error-message="errors[0]"
              autofocus
              hide-details
              dense
              outlined
            ></v-text-field>
            <p class="error-msg">{{ errors[0] }}</p>
          </ValidationProvider>

        </v-col>

        <v-col v-if="type === 'iframe'" cols="8">

          <v-subheader class="px-0">
            Вставить code &lt;/&gt;
          </v-subheader>

          <ValidationProvider
            name="link"
            rules="required|iframe"
            v-slot="{ errors, valid, validated }"
          >
            <v-textarea
              v-model="iframeSrc"
              :success="valid && validated"
              :error="!valid && validated"
              :error-message="errors[0]"
              no-resize
              hide-details
              dense
              outlined
            ></v-textarea>
            <p class="error-msg">{{ errors[0] }}</p>
          </ValidationProvider>

        </v-col>

        <v-col v-if="type === 'file'" cols="8">

          <v-subheader class="px-0">
            Загрузите файл
          </v-subheader>

          <vue-dropzone
            id="drop"
            name="url"
            ref="dropzone"
            :options="dropOptions"
            :include-styling="false"
            :useCustomSlot="true"
            :autoProcessQueue="false"
            @vdropzone-file-added="addedFile"
            @vdropzone-sending="sendingEvent"
          >
            <div class="file-wrapper">
              <div class="file-wrapper-info">
                Файлы .doc , .docx , .pdf .word , .png , .jpeg
              </div>
              <div class="file-wrapper-btn">
                <img src="@/assets/clip.svg" alt="" />
                Загрузить файлы
              </div>
            </div>
          </vue-dropzone>

        </v-col>

        <v-col cols="12">
          <v-btn
            type="submit"
            :disabled="invalidForm"
            color="primary"
            depressed
          >Сохранить</v-btn>
        </v-col>

      </v-row>
    </v-container>
  </ValidationObserver>
</template>

<script>
import vueDropzone from 'vue2-dropzone';
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import isURL from 'validator/lib/isURL';

const iframeRegex = /<iframe(?=[^>]*src="([^"]+)")[^>]*><\/iframe>/ig;
const getTemplate = () => `
<div class="dz-preview file-item dz-file-preview">
  <a class="dz-remove" href="javascript:undefined;" data-dz-remove>
    <span class="dz-filename"><span data-dz-name></span></span>
  </a>
</div>
`;

extend('required', {
  ...required,
  message: 'поле обязательно для заполнения',
});

extend('url', {
  validate: (value) => isURL(value),
  message: 'значение поля должно быть ссылкой',
});

extend('iframe', {
  validate: (value) => {
    const result = value.replace(iframeRegex, '$1');
    return result && isURL(result);
  },
  message: 'значение поля не содержит валидный iframe код',
});

export default {
  name: 'UploadForm',
  components: {
    vueDropzone,
    ValidationObserver,
    ValidationProvider,
  },
  data: () => ({
    type: 'link',
    items: [
      { text: 'Ссылка', value: 'link' },
      { text: 'IFrame', value: 'iframe' },
      { text: 'Файл', value: 'file' },
    ],
    linkSrc: 'asdqwerty',
    iframeSrc: '<iframe  src=""></iframe>',
    dropOptions: {
      url: 'https://httpbin.org/post',
      acceptedFiles: '.doc,.docx,.pdf,.ppt,.png,.jpg',
      uploadMultiple: true,
      maxFilesize: 2,
      maxFiles: 4,
      previewTemplate: getTemplate(),
      addRemoveLinks: true,
    },
  }),
  methods: {
    addedFile(file) {
      const type = file.name.split('.').splice(-1).join('');
      const typeEl = file.previewElement;
      typeEl.classList.add(type);
    },
    async submit() {
      console.log('submitting');
      const { observer, dropzone } = this.$refs;
      await observer.reset();
      const valid = await observer.validate();

      if (valid) {
        if (this.type === 'file') {
          dropzone.processQueue();
        } else {
          this.sendData();
        }
      } else {
        console.log('При проверке формы выявлены ошибки');
      }
    },
    sendingEvent(file, xhr, formData) {
      formData.append('type', 'file');
    },
    sendData() {
      const videoLink = this.type === 'link' ? this.linkSrc : this.iframeSrc;
      const response = {
        type: this.type,
        url: videoLink,
      };

      console.log('Адрес видео для отправки:', response);
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Rubik&amp;display=swap');

$body-bg: #ffffff !default;
$body-color: #333333 !default;
$body-font: 'Rubik', sans-serif !default;

$control-bg: #fff !default;
$control-border: 1px solid #ededed !important !default;
$control-radius: 4px !default;
$control-color: #495057 !default;
$control-border-focused: #cecece !default;

.v-application {
  background-color: $body-bg;
  color: $body-color;
  font-family: $body-font;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

#upload-form {
  .v-subheader {
    color: #354052;
  }

  .v-text-field {
    font-size: 12px;
    line-height: 14px;

    fieldset {
      border: $control-border;
    }

    textarea {
      font-size: 12px;
      line-height: 14px;
      min-height: 281px;

      &:focus {
        outline: none;
      }
    }
  }

  .v-textarea .v-input__slot {
    padding: 8px 16px;
  }

  .v-select {
    font-size: 12px;
    line-height: 14px;

    .v-input__prepend-inner {
      align-self: center;
      margin-right: 6px;
      margin-top: 1px;
    }
  }

  .error-msg {
    color: #F44336;
    font-size: 12px;
    line-height: 14px;
    margin-top: 10px;
    padding-left: 16px;
  }

  .v-btn {
    font-family: inherit;
    font-size: 16px;
    font-weight: 400;
    height: 40px;
    letter-spacing: 0;
    line-height: 20px;
    padding: 10px 31px;
    text-transform: none;
  }

  .theme--light.v-btn {
    background-color: #2852b9;

    &.v-btn--disabled {
      background-color: #f3f3f5;
      color: #7f8fa4;
    }
  }

  .success--text {
    position: relative;

    &::before {
      background-color: #2f75ec;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='19'%3E%3Cpath fill='%23fff' d='M13.2 6.3L8 11.6 5.9 9.4c-.8-.9-2.2.4-1.3 1.3l2.7 2.8c.4.4.9.4 1.3 0l5.8-5.9c.9-.9-.4-2.1-1.2-1.3z'/%3E%3C/svg%3E");
      border-radius: 50%;
      content: "";
      display: block;
      height: 19px;
      position: absolute;
      right: 19px;
      top: 9px;
      width: 19px;
      z-index: 1;
    }

    fieldset {
      border-color: #2f75ec;
    }
  }

  .error--text {
    position: relative;

    &::before {
      background-color: #e3151a;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect fill='%23ffffff' x='5.25' y='7' width='5.5' height='2' /%3E%3C/svg%3E");
      border-radius: 50%;
      content: "";
      display: block;
      height: 16px;
      position: absolute;
      right: 20px;
      top: 11px;
      width: 16px;
      z-index: 1;
    }

    fieldset {
      border-color: #e3151a;
    }
  }
}

.file-wrapper {
  align-items: center;
  background-color: rgba(255, 255, 255, .04);
  border-radius: 4px;
  border: 1px dashed #a5b1bf;
  cursor: pointer;
  display: flex;
  margin-bottom: 14px;
  padding: 16px 23px;
  transition: background-color .15s ease-in-out, border .15s ease-in-out;

  &.valid,
  .dz-started & {
    background-color: rgba(47, 117, 236, .04);
    border: 1px solid #2f75ec;
  }

  &.invalid {
    background-color: rgba(255, 255, 255, .04);
    border: 1px solid #e64a19;
  }
}

.file-wrapper-info {
  align-items: center;
  color: #7f8fa4;
  display: flex;
  font-size: 12px;
  line-height: 1.5;
  padding-right: 23px;
}

.file-wrapper-btn {
  align-items: flex-start;
  border-radius: 3px;
  border: 1px solid #2f75ec;
  color: #2f75ec;
  display: flex;
  flex-direction: row;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  padding: 10px 20px;
  white-space: nowrap;

  img {
    margin-right: 9px;
  }
}

.file-list {
  margin-top: 14px;
}

.file-item {
  background-position: 0 50%;
  background-repeat: no-repeat;
  color: #a5b1bf;
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  margin-top: 11px;
  padding: 5px 15px 5px 52px;
  position: relative;

  &::after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath style='fill:none;stroke:%23c5d0de;stroke-width:2;stroke-linecap:round' d='m 1.01,1.01 5.98,5.98 m -5.98,0 5.98,-5.98' /%3E%3C/svg%3E");
    background-position: 50%;
    background-repeat: no-repeat;
    content: '';
    display: block;
    height: 8px;
    margin-top: -4px;
    position: absolute;
    right: 0;
    top: 50%;
    width: 8px;
  }
}

.png, .jpg {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Crect fill='%23e6f9ff' x='0' y='0' rx='8' width='30' height='30' /%3E%3Crect fill='%2386d6f2' x='7.5' y='7.5' width='15' height='15' /%3E%3Ccircle fill='%23ffdc40' cx='10.5' cy='11.5' r='1.5' /%3E%3Cpath fill='%2366e26f' d='m 13.1,13.6 1.9,1.9 4.5,-5 3,2.75 0,5.25 h -15 z' /%3E%3Cpath fill='%2348cc4e' d='m 7.5,18.5 v 4 h 15 v -4 z' /%3E%3C/svg%3E");
}

.doc, .docx {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Crect width='30' height='30' rx='8' fill='%232A5699' fill-opacity='0.1' /%3E%3Cpath fill='%23ffffff' stroke='%232a5699' stroke-width='0.44443759' d='m 14.888889,9.3335073 h 7.444444 c 0.246222,0 0.444444,0.1982161 0.444444,0.4444308 v 10.4441239 c 0,0.246215 -0.198222,0.444431 -0.444444,0.444431 h -7.444444 c -0.246222,0 -0.444444,-0.198216 -0.444444,-0.444431 v -10.4441239 c 0,-0.2462147 0.198222,-0.4444308 0.444444,-0.4444308 z' /%3E%3Cpath fill='%232a5699' d='m 15.555556,7.7779995 -7.5555552,1.3332924 v 11.7774161 l 7.5555552,1.333292 h 1.333333 v -3.111015 h 4.444444 v -0.666646 h -4.444444 v -0.888862 h 4.444444 v -0.666646 h -4.444444 v -0.888862 h 4.444444 v -0.666646 h -4.444444 v -0.888861 h 4.444444 v -0.666647 h -4.444444 v -0.888861 h 4.444444 v -0.666647 h -4.444444 v -0.888861 h 4.444444 v -0.666646 h -4.444444 v -2.8888005 z' /%3E%3Cpath fill='%23ffffff' d='m 14.888889,12.333415 -1.089214,0.06534 -0.610786,3.490106 -0.704514,-3.41118 -0.960286,0.05762 -0.724088,3.353565 -0.534484,-3.278046 -0.932183,0.05592 0.944444,4.555416 0.960764,0.04724 0.705903,-3.269365 0.689388,3.337983 1.032834,0.0508 z' /%3E%3C/svg%3E");
}

.ppt, .pdf {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Crect width='30' height='30' rx='8' fill='%23e64a19' fill-opacity='.1' /%3E%3Crect fill='%23ff8a65' x='13.252493' y='9.2530279' width='9.2475042' height='11.496897' ry='0.49986577' /%3E%3Cpath fill='%23fbe9e7' d='m 18.251151,10.499639 v 2.499328 h 2.499325 c 0,-1.374631 -1.124475,-2.499328 -2.499325,-2.499328 z m -0.749655,0.749645 c -1.010889,0 -1.922227,0.608952 -2.309053,1.542865 -0.386826,0.933912 -0.172952,2.008857 0.541865,2.723681 0.714774,0.714774 1.789757,0.928671 2.723668,0.541845 0.933912,-0.386816 1.542847,-1.298184 1.542847,-2.309063 h -2.499327 z m -2.124424,5.873417 v 0.749651 h 5.498512 v -0.749651 z m 0,1.624566 v 0.749645 h 5.498512 v -0.749645 z' /%3E%3Cpath fill='%23e64a19' d='m 7.500002,9.253048 8.747633,-1.749528 v 14.992959 l -8.747633,-1.749526 z' /%3E%3Cpath fill='%23ffffff' d='m 10.003377,12.124199 v 5.748453 h 1.249663 v -1.999465 h 0.499859 c 1.624565,0 2.37436,-0.874761 2.37436,-1.874121 0,-1.124466 -0.624827,-1.874117 -2.124425,-1.874117 z m 1.249663,0.999736 h 0.674682 c 0.487356,0 0.887254,0.249924 0.887254,0.874761 0,0.624827 -0.399898,0.874762 -0.887254,0.874762 h -0.674682 z' /%3E%3C/svg%3E");
}
</style>
