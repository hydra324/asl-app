import { Component, ElementRef, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { registerCallbackConstructor } from '@tensorflow/tfjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'asl-app';
  imageSrc: any;
  model: tf.LayersModel | null = null;
  @ViewChild('image',{static:true}) image: ElementRef;
  output: number;
  showResult=false;
  showModel=false;

  async loadModel() {
    const modelUrl = '/assets/asl_tfjs/model.json';
    this.model = await tf.loadLayersModel(modelUrl);
    console.log("Model loaded");
    console.log(this.model.summary());
    this.showModel = true;
  }
  
  onFileSelected(event:any):void {
    let selectedFile = event.target.files[0];
    let reader = new FileReader();

    reader.onload = e => {
    this.imageSrc = reader.result;
    };

    reader.readAsDataURL(selectedFile);
  }

  async predict(event:any):Promise<void> {
    console.log('clicked predict!');

    let img = tf.browser.fromPixels(this.image.nativeElement);
    img = tf.cast(img,'float32');
    img = img.expandDims(0);
    const result = this.model?.predict(img);
    console.log(result);
    this.output = (await (result as tf.Tensor).as1D().argMax().data())[0]
    this.showResult = true;
  }
}
