<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      color="info"
      app
      clipped
    >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.text"
          v-on:click="route(item.path, item.isHome)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-brightness-4</v-icon>
          </v-list-item-action>
          <v-list-item-title>
            <v-switch
              class="toggle"
              v-model="$vuetify.theme.dark"
            ></v-switch>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="primary"
      dense
    >
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        color="secondary darken-4"
      ></v-app-bar-nav-icon>
      <v-icon
        class="mx-4"
        color="secondary darken-4"
        large
      >
        mdi-google-photos
      </v-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title secondary--text text--darken-4">pkchr</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-row
        align="center"
        style="max-width: 650px"
      >
        <v-text-field
          :append-icon-cb="() => {}"
          v-model="tag"
          @keyup.enter.native="route(`/search/${tag}`)"
          placeholder="Search..."
          single-line
          append-icon="mdi-magnify"
          color="secondary darken-4"
          hide-details
        ></v-text-field>
      </v-row>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row dense v-if="isDefault">
          <v-col
            v-for="tag in tags.slice(1)"
            :key="tag.thm_data.photos.photo.id"
            :cols="4"
          >
            <v-card v-on:click="changeTag(tag._content)">
                <v-row dense>
                    <v-col :cols="10">
                      <v-card-title v-text="tag._content"></v-card-title>
                    </v-col>
                    <v-col :cols="2">
                      <v-card-subtitle>
                        <v-btn icon>
                          <v-icon>mdi-bookmark-plus-outline</v-icon>
                        </v-btn>
                      </v-card-subtitle>
                    </v-col>
                  </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import router from './router';
import flickrAPIKey from './flickr-config';

export default Vue.extend({
  name: 'App',
  components: {},
  data: () => ({
    drawer: true,
    isDefault: true,
    items: [],
    tags: [],
    tag: '',
  }),
  watch: {},
  mounted() {
    this.defaultTag();
    this.items = [
      {
        icon: 'mdi-google-photos', text: 'Home', path: `/search/${this.tag}`, isHome: true,
      },
      {
        icon: 'mdi-image-multiple', text: 'My Photos', path: '/photos', isHome: false,
      },
      {
        icon: 'mdi-tag-multiple', text: 'My Tags', path: '/tags', isHome: false,
      },
      {
        icon: 'mdi-card-account-details', text: 'My Account', path: '/account', isHome: false,
      },
    ];
  },
  methods: {
    route(path, isHome) {
      this.isDefault = isHome;
      router.push(path);
    },
    defaultTag() {
      this.getHotTags()
        .then((response) => {
          // eslint-disable-next-line no-underscore-dangle
          this.tags = response.data.hottags.tag;
          // eslint-disable-next-line prefer-destructuring
          // eslint-disable-next-line no-underscore-dangle
          this.tag = this.tags[0]._content;
          this.route(`/search/${this.tag}`, true);
          this.items[0].path = `/search/${this.tag}`;
          localStorage.tag = this.tag;
        });
    },
    getHotTags() {
      return axios({
        method: 'get',
        url: 'https://api.flickr.com/services/rest',
        params: {
          method: 'flickr.tags.getHotList',
          api_key: flickrAPIKey,
          count: '4',
          format: 'json',
          nojsoncallback: 1,
        },
      });
    },
    changeTag(tag) {
      this.tag = tag;
      this.items[0].path = `/search/${this.tag}`;
      this.route(`/search/${this.tag}`, true);
    },
  },
});
</script>

<style>
.toggle {
  margin-left: 3px;
}
</style>
