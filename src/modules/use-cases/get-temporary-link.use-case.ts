import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IMeasureRepository } from '../measure/repository/measure.interface.repository';

@Injectable()
export class GetTemporaryLinkUseCase {
  @Inject('IMeasureRepository')
  private readonly measureRepository: IMeasureRepository;

  async execute(link_uuid: string) {
    const imageLink = await this.measureRepository.findTempLinkById(link_uuid);

    if (imageLink === undefined) {
      throw new NotFoundException({
        error_code: 'INVALID_LINK',
        error_description: 'Link não encontrado ou expirado',
      });
    }

    if (imageLink.expiration_time < Date.now()) {
      this.measureRepository.removeTempLink(link_uuid);
      throw new NotFoundException({
        error_code: 'INVALID_LINK',
        error_description: 'Link não encontrado ou expirado',
      });
    }

    return imageLink.path;
  }
}
