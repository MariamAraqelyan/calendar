import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-daily',
  imports: [],
  standalone: true,
  templateUrl: './daily.html',
  styleUrl: './daily.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Daily {

}
