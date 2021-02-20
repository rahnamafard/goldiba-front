<template>
  <div>
    <div v-for="(menu, i) in menues" :key="menu.title + i">
      <v-card
        class="mx-auto mb-6"
        v-show="menu.items.filter(item => item.active).length > 0"
        dark
      >
        <v-navigation-drawer permanent width="100%">
          <v-list-item
            v-if="
              menu.title !== undefined &&
                menu.title !== null &&
                menu.title !== ''
            "
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ menu.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense nav>
            <div
              v-for="(item, j) in menu.items"
              :key="item.title + j"
              :to="item.link"
            >
              <v-list-item v-if="item.type === 'item' && item.active">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-group
                v-if="
                  item.type === 'group' &&
                    item.active &&
                    item.items.filter(item => item.active).length > 0
                "
                v-model="item.value"
                :key="item.title"
              >
                <template v-slot:activator>
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item
                  v-for="list_item in item.items"
                  v-show="list_item.active"
                  :key="list_item.title"
                  :to="list_item.link"
                >
                  <v-list-item-icon>
                    <v-icon>{{ list_item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ list_item.title }}</v-list-item-title>
                </v-list-item>
              </v-list-group>
            </div>
          </v-list>
        </v-navigation-drawer>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ["menues"]
};
</script>
