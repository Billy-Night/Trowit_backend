-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema trowit_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema trowit_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `trowit_db` DEFAULT CHARACTER SET utf8 ;
USE `trowit_db` ;

-- -----------------------------------------------------
-- Table `trowit_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trowit_db`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `image_url` VARCHAR(255) NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NOT NULL,
  `hash_password` VARCHAR(100) NOT NULL,
  `birthday` DATE NULL,
  `subscription` VARCHAR(45) NULL,
  `date` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trowit_db`.`cards`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trowit_db`.`cards` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `image` VARCHAR(45) NULL,
  `type` VARCHAR(45) NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `title` VARCHAR(45) NULL,
  `department` VARCHAR(45) NULL,
  `company` VARCHAR(45) NULL,
  `phone` INT NULL,
  `email` VARCHAR(45) NULL,
  `address` VARCHAR(100) NULL,
  `website` VARCHAR(100) NULL,
  `link` VARCHAR(100) NULL,
  `pdf` VARCHAR(45) NULL,
  `twitter` VARCHAR(45) NULL,
  `instagram` VARCHAR(45) NULL,
  `linkedin` VARCHAR(45) NULL,
  `facebook` VARCHAR(45) NULL,
  `youtube` VARCHAR(45) NULL,
  `whatsapp` VARCHAR(45) NULL,
  `documents` VARCHAR(45) NULL,
  `files` VARCHAR(45) NULL,
  `colour` VARCHAR(45) NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`, `users_id`),
  INDEX `fk_cards_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_cards_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `trowit_db`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trowit_db`.`contacts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trowit_db`.`contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `add_date` DATE NULL,
  `add_time` TIME NULL,
  `contact_type` VARCHAR(45) NULL,
  `tag1` VARCHAR(45) NULL,
  `tag2` VARCHAR(45) NULL,
  `tag3` VARCHAR(45) NULL,
  `tag4` VARCHAR(45) NULL,
  `notes` VARCHAR(300) NULL,
  `group` VARCHAR(45) NULL,
  `users_id` INT NOT NULL,
  `cards_id` INT NOT NULL,
  PRIMARY KEY (`id`, `users_id`, `cards_id`),
  INDEX `fk_contacts_users1_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_contacts_cards1_idx` (`cards_id` ASC) VISIBLE,
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `trowit_db`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contacts_cards1`
    FOREIGN KEY (`cards_id`)
    REFERENCES `trowit_db`.`cards` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trowit_db`.`card_order_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trowit_db`.`card_order_address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `street_and_number` VARCHAR(100) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `zip_code` VARCHAR(45) NOT NULL,
  `country` VARCHAR(45) NOT NULL,
  `phone_number` INT NOT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`, `users_id`),
  INDEX `fk_card_order_address_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_card_order_address_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `trowit_db`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trowit_db`.`order_physical_card`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trowit_db`.`order_physical_card` (
  `id` INT NOT NULL,
  `plan` VARCHAR(45) NULL,
  `users_id` INT NOT NULL,
  `card_order_address_id` INT NOT NULL,
  `card_order_address_users_id` INT NOT NULL,
  PRIMARY KEY (`id`, `users_id`, `card_order_address_id`, `card_order_address_users_id`),
  INDEX `fk_order_physical_card_users1_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_order_physical_card_card_order_address1_idx` (`card_order_address_id` ASC, `card_order_address_users_id` ASC) VISIBLE,
  CONSTRAINT `fk_order_physical_card_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `trowit_db`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_order_physical_card_card_order_address1`
    FOREIGN KEY (`card_order_address_id` , `card_order_address_users_id`)
    REFERENCES `trowit_db`.`card_order_address` (`id` , `users_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trowit_db`.`order_physical_card_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trowit_db`.`order_physical_card_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NULL,
  `time` TIME NULL,
  `front_design` VARCHAR(45) NULL,
  `back_design` VARCHAR(45) NULL,
  `front_cust_design` VARCHAR(45) NULL,
  `back_cust_design` VARCHAR(45) NULL,
  `cards_id` INT NOT NULL,
  `order_physical_card_id` INT NOT NULL,
  PRIMARY KEY (`id`, `cards_id`, `order_physical_card_id`),
  INDEX `fk_order_physical_card_details_cards1_idx` (`cards_id` ASC) VISIBLE,
  INDEX `fk_order_physical_card_details_order_physical_card1_idx` (`order_physical_card_id` ASC) VISIBLE,
  CONSTRAINT `fk_order_physical_card_details_cards1`
    FOREIGN KEY (`cards_id`)
    REFERENCES `trowit_db`.`cards` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_order_physical_card_details_order_physical_card1`
    FOREIGN KEY (`order_physical_card_id`)
    REFERENCES `trowit_db`.`order_physical_card` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
