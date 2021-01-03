<template>
  <div>
    <div>
      <HelloWorld />
      <ProjectForm v-bind:projects="projects" />
    </div>
    <ProjectList
      v-bind:projects="projects"
      :deleteProject="deleteProject"
      :copyProject="copyProject"
    />
  </div>
</template>

<script>
import HelloWorld from "../components/HelloWorld.vue";
import ProjectForm from "../components/projectForm.vue";
import ProjectList from "../components/projectList.vue";

export default {
  name: "App",
  data: () => ({
    projects: JSON.parse(localStorage.getItem("projects"))
      ? JSON.parse(localStorage.getItem("projects"))
      : [],
  }),
  methods: {
    deleteProject(item) {
      const index = this.projects.indexOf(item);
      this.projects = [
        ...this.projects.slice(0, index),
        ...this.projects.slice(index + 1),
      ];
      localStorage.setItem("projects", JSON.stringify(this.projects));
    },
    copyProject(item) {
      const newItem = {
        id: Date.now().toString(),
        projectName: "Copy of " + item.projectName,
        projectDesc: item.projectDesc,
      };
      this.projects.push(newItem);
      (this.projectName = null), (this.projectDesc = null);
      localStorage.setItem("projects", JSON.stringify(this.projects));
    },
  },
  components: {
    HelloWorld,
    ProjectForm,
    ProjectList,
  },
};
</script>

<style></style>
