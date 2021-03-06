<template>
<v-expansion-panel expand>
  <v-expansion-panel-content :value='true'>
    <div slot='header' class='title'>Browse Files</div>
    
    <v-card>
      <v-card-text>
        <v-tooltip bottom :close-delay='1'>
          <v-select
            slot='activator'
            prepend-icon='keyboard_arrow_left'
            :prepend-icon-cb='() => move("left")'
            append-icon='keyboard_arrow_right'
            :append-icon-cb='() => move("right")'
            :items='fileList'
            v-model='selectedFile'
            single-line
            chips
            deletable-chips
            bottom
            hide-details
            max-height='150'
            autocomplete
          ></v-select>
          <span>Use arrow keys <code><i class='fa fa-caret-left'></i> | <i class='fa fa-caret-right'></i></code> to browse data.</span>
        </v-tooltip>
      </v-card-text>
    </v-card>
  </v-expansion-panel-content>

  <v-expansion-panel-content :value='true'>
    <div slot='header' class='title'>Tags</div>
    <v-card>
      <v-card-text>
      <v-select
        :prepend-icon='edit ? "cancel" : "edit"'
        :prepend-icon-cb='toggleEdit'
        v-model='selectedTags'
        multiple
        chips
        deletable-chips
        tags
        :items='allTags'
        :readonly='!edit'
      ></v-select>
      <div class='text-xs-right'>
        <v-btn small outline flat v-if='edit' @click='cancelEdit' color='error'>
          <v-icon left>cancel</v-icon>
          <span>Cancel</span>
        </v-btn>
        <v-btn small outline flat v-if='edit' @click='saveEdit' color='success'>
          <v-icon left>check_circle</v-icon>
          <span>Save Tags</span>
        </v-btn>
      </div>
      </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'SidebarBrowse',
  data() {
    return {
      edit: false,
      selectedFile: null,
      tempSelectedTags: [],
      selectedTags: [],
      tags: [],
      active: false,
    };
  },
  computed: {
    allFiles() {
      return Object.assign({}, this.fetched, this.uploaded);
    },
    fileList() {
      return _.uniq(Object.keys(this.allFiles));
    },
    uKeys() {
      return Object.keys(this.uploaded);
    },
    uTags() {
      if (!this.uKeys.length) return [];
      return this.uKeys.map(el => this.uploaded[el].tags)
        .reduce((a, b) => a.concat(b));
    },
    fKeys() {
      return Object.keys(this.fetched);
    },
    fTags() {
      if (!this.fKeys.length) return [];
      return this.fKeys.map(el => this.fetched[el].tags)
        .reduce((a, b) => a.concat(b));
    },
    allTags() {
      if (!this.fTags.length && !this.uTags.length) return [];

      return this.fTags.concat(this.uTags);
    },
  },
  methods: {
    move(direction) {
      if (!this.fileList.length) return;
      const index = this.fileList.indexOf(this.selectedFile);
      const end = this.fileList.length - 1;

      if (direction === 'right') {
        this.selectedFile = this.fileList[index === end ? 0 : index + 1];
      } else {
        this.selectedFile = this.fileList[index === 0 ? end : index - 1];
      }
    },
    toggleEdit() {
      if (!this.fileList.length || this.selectedFile === null) return;

      if (!this.edit) {
        this.tempSelectedTags = this.selectedTags;
        this.edit = !this.edit;
      } else {
        this.selectedTags = this.tempSelectedTags;
        this.edit = !this.edit;
      }
    },
    cancelEdit() {
      this.selectedTags = this.tempSelectedTags;
      this.edit = !this.edit;
    },
    saveEdit() {
      this.edit = !this.edit;
      // below updates selected file's tag list
      const loadType = this.allFiles[this.selectedFile].loadType;
      const payload = {
        loadType,
        filename: this.selectedFile,
        tags: this.selectedTags,
      };

      this.updateTags(payload);
    },
    onKeyUp(event) {
      const isRight = event.key === 'ArrowRight' || event.code === 'ArrowRight';
      const isLeft = event.key === 'ArrowLeft' || event.code === 'ArrowLeft';
      if (isRight || isLeft) this.move(isRight ? 'right' : 'left');
    },
  },
  activated() {
    // automatically plot file when activated
    if (this.fileList.length && this.selectedFile === null) {
      this.selectedFile = this.fileList[0];
    }
    this.active = true;
    // When activated toggle on arrow keys for browsing files
    window.addEventListener('keyup', this.onKeyUp);
  },
  deactivated() {
    this.active = false;
    // when deactivated toggle off arrows keys for browsing files
    window.removeEventListener('keyup', this.onKeyUp);
  },
  watch: {
    fileList() {
      // automatically plot file when fetched
      if (this.fileList.length && this.selectedFile === null && this.active) {
        this.selectedFile = this.fileList[0];
      }
    },
    selectedFile() {
      if (this.selectedFile === null) {
        this.xPoint = null;
        this.yPoint = null;
        this.errorPoint = null;
        this.tempSelectedTags = [];
        this.selectedTags = [];
        this.setBrowseData([]);
      } else {
        const vm = this;
        // Update tags to current file selected
        this.selectedTags = this.allFiles[this.selectedFile].tags;

        const tempData = vm.getSavedFile(this.selectedFile);

        if (tempData === '999') {
          this.read1DData(this.getURLs([this.selectedFile]), [], 'QuickPlot');
        } else {
          this.setBrowseData(tempData);
        }
      }
    },
  },
};
</script>

<style lang='scss'>
.input-group__details::before {
  width: 85%;
}

.input-group__details::after {
  visibility: hidden;
}

.input-group__prepend-icon {
  padding-left: 5px !important;
}

.input-group__append-icon {
  padding: 0px 25px !important;
}

.input-group__append-icon:focus {
  outline: none !important;
}
</style>
