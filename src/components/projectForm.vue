<template>
  <div class="create-project-home">
    <md-card>
      <md-card-content>
        <div @click="isColapse = true">
          <md-field md-inline>
            <label>Project Name</label>
            <md-input v-model="projectName" maxlength="100"></md-input>
          </md-field>
        </div>
        <transition name="fade">
          <div v-if="isColapse">
            <md-field>
              <label>Project Description</label>
              <md-textarea v-model="projectDesc" md-counter="500"></md-textarea>
            </md-field>
            <div class="center">
              <md-button @click="isColapse = false">CANCEL</md-button>
              <md-button
                class="md-raised md-primary"
                :disabled="isDisabled"
                @click="addProject"
                >CREATE</md-button
              >
            </div>
          </div>
        </transition>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
  name: "ProjectForm",
  data: () => ({
    projectName: null,
    projectDesc: null,
    isColapse: false,
  }),
  props: {
    projects: Array,
  },
  methods: {
    addProject() {
      const newItem = {
        id: Date.now().toString(),
        projectName: this.projectName,
        projectDesc: this.projectDesc,
      };
      this.projects.push(newItem);
      (this.projectName = null), (this.projectDesc = null);
      localStorage.setItem("projects", JSON.stringify(this.projects));
    },
  },
  computed: {
    isDisabled() {
      return !this.projectName || !this.projectDesc;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.create-project-home {
  min-width: 400px;
  max-width: 600px;
  width: 100%;
  margin: 10px auto;
}
.none {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  overflow: hidden;
  max-height: 230px;
  transition: max-height 0.4s;
}
.fade-enter,
.fade-leave-to {
  max-height: 0px;
}
</style>
