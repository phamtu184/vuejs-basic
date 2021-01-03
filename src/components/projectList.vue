<template>
  <div>
    <strong class="sub-title">All Projects</strong>
    <hr class="mt-1 hr" />
    <div class="row justify-content-left">
      <div
        v-for="project in projects"
        :key="project.id"
        class="col-md-3 col-sm-4 col-lg-2 mb-5 gui-sm my-column"
      >
        <md-card md-with-hover>
          <md-ripple>
            <md-card-header
              class="md-card-header card-header d-flex justify-content-between "
            >
              <div class="project-name">{{ project.projectName }}</div>
              <button
                @click="(activeCopied = true), (selected = project)"
                class="removeBtn"
              >
                <svg
                  data-v-0f402151=""
                  class="svg-inline--fa fa-copy fa-w-14 fa-lg"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="copy"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"
                  ></path>
                </svg>
              </button>
            </md-card-header>

            <md-card-content class="md-card-content card-body ellipsis-text">
              {{ project.projectDesc }}
            </md-card-content>

            <md-card-actions>
              <md-button @click="ShowDialogEdit(project)">Edit</md-button>
              <md-button @click="(activeDelete = true), (selected = project)"
                >Delete</md-button
              >
            </md-card-actions>
          </md-ripple>
        </md-card>
      </div>
    </div>
    <md-dialog-confirm
      :md-active.sync="activeDelete"
      md-title="Confirm"
      :md-content="
        `Project ${this.selected.projectName} is going to be removed. Are you sure?`
      "
      md-confirm-text="OK"
      md-cancel-text="Cancel"
      @md-confirm="deleteProject(selected)"
    />
    <md-dialog-confirm
      :md-active.sync="activeCopied"
      md-title="Confirm"
      :md-content="
        `Project ${this.selected.projectName} is going to be copied. Do you want to continue?`
      "
      md-confirm-text="OK"
      md-cancel-text="Cancel"
      @md-confirm="copyProject(selected)"
    />
    <md-dialog :md-active.sync="showDialogEdit">
      <md-dialog-title>Edit project</md-dialog-title>
      <div class="create-project-home">
        <md-content class="padding-8">
          <md-field md-inline>
            <label>Project Name</label>
            <md-input v-model="tfName" maxlength="100"></md-input>
          </md-field>
          <md-field>
            <label>Project Description</label>
            <md-textarea v-model="tfDesc" md-counter="500"></md-textarea>
          </md-field>
        </md-content>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialogEdit = false"
          >Cancel</md-button
        >
        <md-button class="md-primary" :disabled="isDisabled" @click="EditProject"
          >Ok</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
export default {
  name: "ProjectList",
  data: () => ({
    activeDelete: false,
    activeCopied: false,
    tfName:null,
    tfDesc:null,
    selected: {},
    showDialogEdit:false,
    idProject:null,
  }),
  props: {
    projects: Array,
    deleteProject: Function,
    copyProject: Function,
  },
  methods:{
    ShowDialogEdit(item){
      this.showDialogEdit = true
      this.tfName=item.projectName
      this.tfDesc=item.projectDesc
      this.idProject=item.id
    },
    EditProject(){
      const index = this.projects.findIndex(x=>x.id==this.idProject);
      const newItem = {
        id: this.idProject,
        projectName: this.tfName,
        projectDesc: this.tfDesc,
      }
      this.projects[index]=newItem;
      this.showDialogEdit = false
      localStorage.setItem("projects", JSON.stringify(this.projects));
    }
  },
  computed: {
    isDisabled() {
      return !this.tfName || !this.tfDesc;
    },
  },
};
</script>

<style scoped>
.sub-title {
  font-size: 13px;
  font-weight: 600;
  color: #202124;
  opacity: 0.8;
}
.hr {
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
.project-name {
  flex-grow: 1;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  line-height: 26px;
  color: #202124;
}
.svg-inline--fa {
  overflow: visible;
  width: 0.875em;
  vertical-align: -0.225em;
  font-size: 1.3333333333em;
  line-height: 0.75em;
  height: 1em;
  display: inline-block;
  color: #448aff;
}
.my-column {
  min-width: 225px;
}
.ellipsis-text {
  overflow-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap !important;
  padding: 1rem;
  color: #80868b;
  cursor: default;
}
.removeBtn {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}
.padding-8 {
  padding: 0 30px;
}
.create-project-home {
  min-width: 500px;
  max-width: 800px;
  width: 100%;
  margin: 10px auto;
}
</style>
