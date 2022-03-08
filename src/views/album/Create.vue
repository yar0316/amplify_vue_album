<template>
  <div>
    <h1>アルバム登録</h1>
    <form @submit.prevent="submitCreate">
      <label>Name</label><br />
      <input v-model="form.name" placeholder="Enter album name" /><br />
      <p>ここに画像フォーム</p>
      <label >Photo</label>
      <input type="file" @change="onFileChange"><br>
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script>
import { API, Storage } from 'aws-amplify'
import { createAlbum } from '../../graphql/mutations'

export default {
  name: 'AlbumCreate',
  data () {
    return {
      form: {
        name: '',
        s3key: ''
      },
      image: null
    }
  },
  methods: {
    onFileChange (e) {
      this.image = e.target.files[0]
    },
    async submitCreate () {
      const s3key = new Date().getItem().toString(16) + this.image.name
      await Storage.put(s3key, this.image, {
        level: 'private'
      })
        .then((result) => {
          this.form.s3key = result.key
        })
        .catch((error) => {
          console.log(error)
        })
      await API.graphql({
        query: createAlbum,
        variables: { input: this.form }
      })
        .then((result) => {
          console.log(result)
          this.$router.push({ name: 'AlbumIndex' })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
