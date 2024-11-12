import { Component } from '@angular/core';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  options: google.maps.MapOptions = {
    mapId: '7ee393fa5ef3450d',
    center: { lat: 50.44679119581261, lng: 30.452053209680113 },
    zoom: 15,
  };

  markers: google.maps.Marker[] = [
    new google.maps.Marker({
      position: { lat: 50.44679119581261, lng: 30.452053209680113 },
      title: 'My Location'
    })
  ];

  ngOnInit() {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, this.options);
    const markerCluster = new MarkerClusterer({ map, markers: this.markers });
  }
}
