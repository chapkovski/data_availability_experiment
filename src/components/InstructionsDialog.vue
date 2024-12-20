<template>
    <div>
        <!-- Instructions Button -->
        <div class="mr-3 align-self-center ma-0 pa-0 " v-if="!smAndDown">
        <v-btn  color="green" elevation="4" rounded="lg" size="large" @click="openDialog">
            Instructions
        </v-btn>
        </div>
        <v-btn v-else icon="mdi-information" density="comfortable" color="green" @click="openDialog" style="z-index: 1000;" >

        </v-btn>

        <!-- Dialog -->
        <v-dialog v-model="dialogVisible" max-width="1200px" persistent>
            <v-card>
                <v-card-text>
                    <div v-html="instructionContent"></div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue" elevation="4" rounded="lg" @click="closeDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { smAndDown, name, height, width } = useDisplay();
import { useTraderStore } from "@/store/app";
import { watch, ref, onMounted, computed } from "vue";
const store = useTraderStore();
const { pauseGame, resumeGame } = store;

// Props


// State
const dialogVisible = ref(false);
const instructionContent = ref("");

// Methods
const openDialog = () => {
    pauseGame(); // Ensure this function is globally accessible or injected
    const content = document.getElementById("instruction_container").innerHTML;
    instructionContent.value = content;
    dialogVisible.value = true;
};

const closeDialog = () => {
    resumeGame(); // Ensure this function is globally accessible or injected
    dialogVisible.value = false;
};
</script>

<style scoped>
/* Add any custom styles here */
</style>